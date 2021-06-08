// Styles
import './VTextarea.sass'

// Extensions
import VTextField from '../VTextField/VTextField'

// Utilities
import mixins from '../../util/mixins'

// Types
import Vue from 'vue'

interface options extends Vue {
  $refs: {
    input: HTMLTextAreaElement
  }
}

const baseMixins = mixins<options &
  InstanceType<typeof VTextField>
>(
  VTextField
)

/* @vue/component */
export default baseMixins.extend({
  name: 'v-textarea',

  props: {
    autoGrow: Boolean,
    noResize: Boolean,
    rowHeight: {
      type: [Number, String],
      default: 24,
      validator: (v: any) => !isNaN(parseFloat(v)),
    },
    rows: {
      type: [Number, String],
      default: 5,
      validator: (v: any) => !isNaN(parseInt(v, 10)),
    },
  },

  computed: {
    classes (): object {
      return {
        'v-textarea': true,
        'v-textarea--auto-grow': this.autoGrow,
        'v-textarea--no-resize': this.noResizeHandle,
        ...VTextField.options.computed.classes.call(this),
      }
    },
    noResizeHandle (): boolean {
      return this.noResize || this.autoGrow
    },
  },

  watch: {
    lazyValue () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    },
    rowHeight () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    },
  },

  mounted () {
    setTimeout(() => {
      this.autoGrow && this.calculateInputHeight()
    }, 0)
  },

  methods: {
    calculateInputHeight () {
      const input = this.$refs.input
      if (!input) return
      const minHeight = parseInt(this.rows, 10) * parseFloat(this.rowHeight)

      let height = 0
      if (input.value) {
        let helperTextArea = this.getHelperTextArea(input)
        if (helperTextArea) {
          helperTextArea.style.width = input.style.width
          helperTextArea.value = input.value
          height = helperTextArea.scrollHeight
        }
      }

      // This has to be done ASAP, waiting for Vue
      // to update the DOM causes ugly layout jumping
      input.style.height = Math.max(minHeight, height) + 'px'
    },
    getHelperTextArea(input) {
      // Get (and create if needed) a helper text area to be able to
      // calculate input height more effectively.
      if (input) {
        const helperId = input.id + '-helper'
        let helperTextArea = document.querySelector('#' + helperId)

        if (helperTextArea) {
          return helperTextArea
        }

        const container = input.parentElement
        if (container) {
          helperTextArea = document.createElement('textarea')
          helperTextArea.id = helperId
          helperTextArea.disabled = true
          helperTextArea.style.height = '0'
          helperTextArea.style.position = 'absolute'
          helperTextArea.style.pointerEvents = 'none'
          helperTextArea.style.visibility = 'hidden'
          container.appendChild(helperTextArea)
          return helperTextArea
        }
      }
      return null
    },
    genInput () {
      const input = VTextField.options.methods.genInput.call(this)

      input.tag = 'textarea'
      delete input.data!.attrs!.type
      input.data!.attrs!.rows = this.rows

      return input
    },
    onInput (e: Event) {
      VTextField.options.methods.onInput.call(this, e)
      this.autoGrow && this.calculateInputHeight()
    },
    onKeyDown (e: KeyboardEvent) {
      // Prevents closing of a
      // dialog when pressing
      // enter
      if (this.isFocused && e.keyCode === 13) {
        e.stopPropagation()
      }

      this.$emit('keydown', e)
    },
  },
})
