<template>
<div
    class="fixed-top d-flex align-items-center justify-content-center"
    style="bottom: 0; overflow-y: auto"
  >
<b-card style="max-width: 540px;"
  header="Login">
  <b-alert
    :show="dismissCountDown"
    :variant="state"
    @dismissed="dismissCountDown=0"
    @dismiss-count-down="countDownChanged">
            {{message}}
  </b-alert>
  <b-form @submit="onSubmit">
    <!-- Default input name -->
    <label for="defaultFormSubscriptionNameEx" class="grey-text">Your name</label>
    <input required type="user_login"
      id="defaultFormSubscriptionNameEx"
      v-model="loginForm.login"
      class="form-control">
    <br>
    <!-- Default input password -->
    <label for="defaultFormSubscriptionPasswordEx" class="grey-text">Your password</label>
    <input required type="password"
      id="defaultFormSubscriptionPasswordEx"
      v-model="loginForm.pass"
      class="form-control">
    <div class="text-center mt-4">
      <button class="btn btn-outline-purple" type="submit">
        Send
      <i class="far fa-paper-plane ml-2"></i></button>
    </div>
    </b-form>
    <!-- Default form subscription -->
    </b-card>
    </div>
</template>
<script>

export default {
  data() {
    return {
      loginForm: {
        login: '',
        pass: '',
      },
      state: '',
      message: '',
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    login(payload) {
      this.$store.dispatch('login', payload)
        .then((res) => {
          this.message = res.data.tokenExp;
          this.state = 'success';
          this.showAlert();
          this.$router.push('/');
        })
        .catch((error) => {
          this.message = 'Unauthorized';
          this.state = 'danger';
          this.showAlert();
          // eslint-disable-next-line
          console.error(error);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      const payload = {
        user_login: this.loginForm.login,
        pass: this.loginForm.pass,
      };
      this.login(payload);
    },
  },
  created() {
    document.title = this.$route.meta.title;
  },
};
</script>
