import { Ref } from '@vue/composition-api'

interface SlickBreakpoint {
  slidesToShow: number
  rows: number
  infinite: boolean
}

interface SlickSlider {
  currentSlide: number,
  breakpointSettings: Array<SlickBreakpoint>
  activeBreakpoint: number
  options: any
  $slides: any
  $slider: HTMLElement
}

interface MakeArrowDisableProps {
  currentSlide: number,
  slider: HTMLElement,
  start: number,
  end: number | undefined
}

class Slider {
  dots = [] as Array<Element>
  dotsWrapper = {} as HTMLElement

  changeSlide (slick: SlickSlider, direction: string) {
    const currentSlide = this.getCurrentSlide(direction, slick)

    this.changeDots(currentSlide)
    this.changeArrow(slick, currentSlide)
  }

  getCurrentSlide (direction: string, slick: SlickSlider) {
    const current = slick.currentSlide
    let currentSlide = 0

    switch (direction) {
      case 'prev': {
        currentSlide = current - 1
        break
      }
      case 'next': {
        currentSlide = current + 1
        break
      }
      case 'swipe': {
        currentSlide = current
        break
      }
      default:
        break
    }

    return currentSlide
  }

  changeDots (currentSlide: number) {
    const lastDot = this.dots[this.dots.length - 1]

    const isGreaterLast = lastDot && currentSlide > 7
    const isSmallerLast = lastDot && currentSlide < 7

    if (isGreaterLast) {
      setTimeout(() => {
        (lastDot as HTMLElement).classList.add('slick-active')
      }, 10)
    } else if (isSmallerLast) {
      (lastDot as HTMLElement).classList.remove('slick-actvie')
    }
  }

  changeArrow (slick: SlickSlider, currentSlide: number) {
    const infiniteMod = this.checkInfiniteMod(slick)

    if (!infiniteMod) {
      const start = 0
      const end = this.getLastSlide(slick)

      const slider = (slick.$slider as any).get(0)

      const makeArrowDisableProps = {
        currentSlide,
        start,
        slider,
        end
      }

      this.makeArrowDisable(makeArrowDisableProps)
    }
  }

  checkInfiniteMod (slick: SlickSlider) {
    const { activeBreakpoint, breakpointSettings } = slick

    const breakpointsEntries = Object.entries(breakpointSettings)

    const currentBreakpoint = breakpointsEntries.find(el => +el[0] === activeBreakpoint)

    let infiniteValue = false

    if (currentBreakpoint) {
      infiniteValue = currentBreakpoint[1].infinite ? currentBreakpoint[1].infinite : slick.options.infinite || false
    }

    return slick.activeBreakpoint ? infiniteValue : slick.options.infinite
  }

  makeArrowDisable (makeArrowDisableProps: MakeArrowDisableProps) {
    const { currentSlide, start, slider, end } = makeArrowDisableProps

    if (currentSlide <= start) {
      (slider.parentNode as HTMLElement).classList.add('slick-disabled-prev')
    } else {
      (slider.parentNode as HTMLElement).classList.remove('slick-disabled-prev')
    }

    if (end && currentSlide >= end) {
      (slider.parentNode as HTMLElement).classList.add('slick-disabled-next')
    } else {
      (slider.parentNode as HTMLElement).classList.remove('slick-disabled-next')
    }
  }

  getLastSlide (slick: SlickSlider) {
    const { activeBreakpoint, breakpointSettings, options, $slides } = slick

    const slidesCounter = $slides.length
    let slidesToShow = 0
    let rowsCounter = 0

    if (activeBreakpoint) {
      const breakpointsEntries = Object.entries(breakpointSettings)

      const currentBreakpoint = breakpointsEntries.find(el => +el[0] === activeBreakpoint)

      if (currentBreakpoint) {
        slidesToShow = currentBreakpoint[1].slidesToShow || options.slidesToShow || 1
        rowsCounter = currentBreakpoint[1].rows || currentBreakpoint[1].rows || options.rows || 1
      }
    } else {
      slidesToShow = options.slidesToShow || 1
      rowsCounter = options.rows || 1
    }

    const oneRow = (slidesCounter - slidesToShow) / rowsCounter
    const greaterOneRow = (slidesCounter - slidesToShow)

    return rowsCounter > 1 ? greaterOneRow : oneRow
  }

  changeLargeDots (slider: Ref) {
    if (slider.value) {
      const { currentSlide } = slider.value.$el.slick

      const arrowProps = {
        currentSlide,
        start: 0,
        end: undefined,
        slider: slider.value.$el as HTMLElement
      }

      this.makeArrowDisable(arrowProps)

      this.dotsWrapper = slider.value.$el.slick.$dots?.get(0)

      if (this.dotsWrapper) {
        const dotsArray = Array.from(this.dotsWrapper.children)

        if (dotsArray.length > 8) {
          this.dots = dotsArray.splice(0, 8)

          this.dotsWrapper.innerHTML = ''
          this.dots.forEach(item => this.dotsWrapper.appendChild(item))
        }
      }
    }
  }

  changeLargeDotsAfterResize (slider: Ref) {
    let timeoutResize = 0

    global.window?.addEventListener('resize', () => {
      if (timeoutResize) {
        clearTimeout(timeoutResize)
      }

      timeoutResize = global.window.setTimeout(() => {
        this.changeLargeDots(slider)
      }, 150)
    })
  }
}

export default () => {
  const slider = new Slider()

  const changeLargeDots = slider.changeLargeDots.bind(slider)
  const changeSlide = slider.changeSlide.bind(slider)
  const changeLargeDotsAfterResize = slider.changeLargeDotsAfterResize.bind(slider)

  return {
    changeLargeDots,
    changeSlide,
    changeLargeDotsAfterResize
  }
}
