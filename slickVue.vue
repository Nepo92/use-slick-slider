<template>
  <div class="slider-category">
    <slick ref="slider" class="slider-category__slick-wrapper" :options="sliderOptions" @swipe="(e) => swipe(e)">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="slider-category__item"
      >
        <CatalogCategoriesItem
          :image="item.image"
          :text="item.title"
          :location="item.location"
          :image-blur-hash="item.imageBlurHash"
          :class="{'slider-category__category': true}"
        />
      </div>
    </slick>
    <div class="slider-category__arrow-prev" @click="prev">
      <SliderArrow :direction="arrowPositionPrev" />
    </div>
    <div class="slider-category__arrow-next" @click="next">
      <SliderArrow :direction="arrowPositionNext" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { ref, onMounted } from '@vue/composition-api'
import Slick from 'vue-slick'
import { SliderArrowDirection } from './Arrow.vue'
import CatalogCategory from '~/models/catalogCategory'
import useSlider from '~/composition/slider/useSlider'

export default defineComponent({
  components: {
    Slick
  },
  props: {
    categories: {
      type: Array as PropType<CatalogCategory[]>,
      default: () => []
    }
  },
  setup () {
    const {
      changeLargeDots,
      changeSlide,
      changeLargeDotsAfterResize
    } = useSlider()
    const slider = ref()

    const prev = () => {
      const slick = slider.value.$el.slick

      changeSlide(slick, 'prev')
      slider.value.prev()
    }

    const next = () => {
      const slick = slider.value.$el.slick

      changeSlide(slick, 'next')
      slider.value.next()
    }

    const swipe = (e: Event) => {
      const slick = (e.target as any).slick

      changeSlide(slick, 'swipe')
    }

    const sliderOptions = {
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dotsClass: 'slider-category__pagination',
      adaptiveHeight: true,
      draggable: false,
      responsive: [
        {
          breakpoint: 1260,
          settings: {
            dots: true,
            slidesToShow: 3
          }
        },
        {
          breakpoint: 960,
          settings: {
            rows: 2,
            slidesToShow: 2,
            dots: true
          }
        }
      ]
    }

    onMounted(() => {
      changeLargeDots(slider)
      changeLargeDotsAfterResize(slider)
    })

    return {
      slider,
      sliderOptions,
      arrowPositionPrev: SliderArrowDirection.Left,
      arrowPositionNext: SliderArrowDirection.Right,
      prev,
      next,
      swipe
    }
  }
})
</script>
