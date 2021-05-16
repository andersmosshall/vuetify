// Styles
import './VTimelineHorizontal.sass'

// Components
import VTimelineDivider from './VTimelineDivider'
import VTimelineSide from './VTimelineSide'
import { VTimelineSymbol } from './VTimeline'

// Utilities
import { defineComponent, inject } from 'vue'
import { convertToUnit } from '@/util'

export default defineComponent({
  name: 'VTimelineHorizontal',

  inheritAttrs: false,

  props: {
    lineColor: String,
    lineWidth: [String, Number],
  },

  setup (props, ctx) {
    const timeline = inject(VTimelineSymbol)

    if (!timeline) throw new Error('asd')

    return () => {
      return (
        <div
          class="v-timeline-horizontal"
          style={{
            // @ts-ignore
            '--v-timeline-line-width': convertToUnit(props.lineWidth),
          }}
        >
          <div class="v-timeline-horizontal__before">
            { timeline.items.value.map(item => (
              <div class="v-timeline-horizontal__cell" key={item.id}>
                <VTimelineSide {...props} {...item.elements.before.props} v-slots={item.elements.before.slots} />
              </div>
            )) }
          </div>
          <div class="v-timeline-horizontal__divider">
            { timeline.items.value.map(item => (
              <div class="v-timeline-horizontal__cell" key={item.id}>
                <VTimelineDivider {...props} {...item.elements.divider.props} v-slots={item.elements.divider.slots} />
              </div>
            )) }
          </div>
          <div class="v-timeline-horizontal__after">
            { timeline.items.value.map(item => (
              <div class="v-timeline-horizontal__cell" key={item.id}>
                <VTimelineSide {...props} {...item.elements.after.props} v-slots={item.elements.after.slots} />
              </div>
            )) }
          </div>
          { ctx.slots.default?.() }
        </div>
      )
    }
  },
})
