<template>
  <div class="container-fluid">
    <apptabs></apptabs>
    <br>
    <div class="row">
    <div class="col-9">
    <h1>Development Databases</h1>
      <div class="col">
        <b-alert
              :show="dismissCountDown"
              :variant="state"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
            >
            {{message}}
        </b-alert>
        <button type="button" class="btn btn-success btn-sm"
          v-b-modal.database-modal>Add New Database</button>
        <br>
        <input type="text"
               placeholder="Filters"
               v-model="filter"
               class="form-control"/>
        <table class="table table-striped">
          <thead>
             <tr>
              <tr>
              <th scope="col" @click="sortBy('title')" style="width: 30%">
                Title
              </th>
              <th scope="col" @click="sortBy('production')" style="width: 10%">
                Production
              </th>
              <th scope="col" @click="sortBy('responsible')" style="width: 15%">
                Responsible
              </th>
              <th scope="col" style="width: 45%"></th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(db, index) in filteredRows" :key="index">
              <td v-html="highlightMatches(db.title)"></td>
              <td>
                <span v-if="db.production">Yes</span>
                <span v-else>No</span>
              </td>
              <td v-html="highlightMatches([...db.responsible].sort().join(', '))"></td>
              <td>
              <div>
               <b-button variant="danger">Delete</b-button>
               <b-button variant="info">Info</b-button>
               <b-button variant="primary">Copy</b-button>
               <b-dropdown split variant="success" text="Launch" size="lg">
                 <b-dropdown-item href="#">Config</b-dropdown-item>
                 <b-dropdown-item href="#">Run with params</b-dropdown-item>
                 <b-dropdown-item href="#">Run with external code</b-dropdown-item>
               </b-dropdown>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    <div class="col-3">
    <h1>Scheduler past here</h1>
    </div>
    </div>
    <b-modal ref="addDBModal"
               id="database-modal"
               title="Add a new database"
               hide-footer>
        <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-form-group id="form-title-group"
                   label="Title:"
                   label-for="form-title-input">
         <b-form-input id="form-title-input"
                       type="text"
                       v-model="addDBForm.title"
                       required
                       placeholder="Enter title">
         </b-form-input>
       </b-form-group>
       <b-form-group id="form-responsible-group"
                     label="Responsible:"
                     label-for="form-responsible-input">
           <b-form-input id="form-responsible-input"
                         type="text"
                         v-model="addDBForm.responsible"
                         required
                         placeholder="Enter responsible">
           </b-form-input>
         </b-form-group>
       <b-form-group id="form-production-group">
         <b-form-checkbox-group v-model="addDBForm.production" id="form-checks">
           <b-form-checkbox value="true">Selected?</b-form-checkbox>
         </b-form-checkbox-group>
       </b-form-group>
       <b-button type="submit" variant="primary">Add</b-button>
       <b-button type="reset" variant="danger">Cancel</b-button>
       </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Tabs from './Tabs';

export default {
  data() {
    return {
      dbs: [],
      currentSort: 'title',
      currentSortDir: 'asc',
      filter: '',
      message: '',
      addDBForm: {
        title: '',
        responsible: '',
        production: [],
      },
      dismissSecs: 5,
      state: 'success',
      dismissCountDown: 0,
    };
  },
  components: {
    apptabs: Tabs,
  },
  methods: {
    getDBs() {
      const path = 'http://dc-pg-dev:3000/dev_db';
      axios.get(path)
        .then((res) => {
          this.dbs = res.data.dbs;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    addDB(payload) {
      const path = 'http://dc-pg-dev:3000/dev_db';
      axios.post(path, payload)
        .then(() => {
          this.message = `Database ${payload.title} added`;
          this.state = 'success';
          this.showAlert();
          this.getDBs();
          // eslint-disable-next-line
          console.log(payload.title);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.message = `Database ${payload.title} not added ${error}`;
          this.state = 'warning';
          this.showAlert();
          this.getDBs();
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },

    initForm() {
      this.addDBForm.title = '';
      this.addDBForm.responsible = '';
      this.addDBForm.production = [];
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addDBModal.hide();
      let production = false;
      if (this.addDBForm.production[0]) production = true;
      const payload = {
        title: this.addDBForm.title,
        responsible: this.addDBForm.responsible,
        production, // сокращённое свойство
      };
      this.addDB(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addDBModal.hide();
      this.initForm();
    },
    highlightMatches(text) {
      const matchExists = text.toLowerCase().includes(this.filter.toLowerCase());
      if (!matchExists) return text;
      const re = new RegExp(this.filter, 'ig');
      return text.replace(re, matchedText => `<strong>${matchedText}</strong>`);
    },
    sortBy(s) {
      // if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    },
  },
  computed: {
    filteredRows() {
      return this.dbs.filter((row) => {
        const title = row.title.toString().toLowerCase();
        const responsible = row.responsible.toLowerCase();
        const searchTerm = this.filter.toLowerCase();
        return responsible.includes(searchTerm) || title.includes(searchTerm);
      }).sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  created() {
    this.getDBs();
    document.title = this.$route.meta.title;
  },
};
</script>
