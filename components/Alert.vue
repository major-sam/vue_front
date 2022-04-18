const Alert = {
  template: '#alert-template',
  props: ['message'],
  methods: {
    hideAlert() {
      // Tell the parent to clear the message
      this.$emit('update:message', '');
    }
  },
  watch: {
    message(newValue) {
      // Close after 5 seconds
      if (newValue) {
        setTimeout(this.hideAlert, 5000);
      }
    }
  }
};
