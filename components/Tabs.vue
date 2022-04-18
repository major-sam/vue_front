<template>
<div>
  <b-navbar toggleable="lg" width="100%" type="dark" variant="dark" fixed="top">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="prod_db" :active='$route.name=="ProdDB"'>Prod</b-nav-item>
        <b-nav-item href="dev_db" :active='$route.name=="DevDB"'>Dev</b-nav-item>
        <b-nav-item href="test" disabled>Test</b-nav-item>
        <b-nav-item href="admin" disabled>Admin</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-avatar rounded class="p-2 mb-0" size ="3em"></b-avatar>
          </template>
          <b-dropdown-item href="#" disabled>Profile</b-dropdown-item>
          <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      </b-collapse>
  </b-navbar>
</div>
</template>
<script>
export default {
  computed: {
    isLoggedIn() { return this.$store.getters.isLoggedIn; },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login');
        });
    },
  },
};
</script>
