/* index.js */
/* todo...
  1. 自己再次实现debounce throttle 防抖 节流
  _.throttle _.debounce
  思维导图。。。
*/
/* Note:
  v-show  
  仅仅作用域display属性
  初始一定渲染 适用于频繁切换
  v-if    
  会销毁重建
  初始为falsy时不渲染, 适用于运行时条件很少改变 且逻辑复杂&消耗大的
  永远不要把 v-if 和 v-for 同时用在同一个元素上。
  直接替换数组元素
    vm.groceryList.splice(0, 1, { id: '22', text: '333'})
    vm.$set(vm.groceryList, 0, { id: '22', text: '333'})
    vm.$set === Vue.set
  直接修改数组的长度:
    vm.groceryList.splice(2)
 */
const {log, error, table} = console;
log('in translate.js');
Vue.component('baseInput', {
  inheritAttrs: false,
  props: ['value', 'label'],
  computed: {
    inputListeners2(event) {
      let vm = this
      log('$listeners', this.$listeners, event.target)
      return Object.assign({}, this.$listeners, {
        input(event) {
          vm.$emit('input', event.target.value)
        }
      })
    },
    inputListeners: function () {
      var vm = this
      log('$listeners', this.$listeners)
      // `Object.assign` 将所有的对象合并为一个新对象
      // 我们从父级添加所有的监听器
      // 然后我们添加自定义监听器，
      // 或覆写一些监听器的行为
      // 这里确保组件配合 `v-model` 的工作
      return Object.assign({},
        this.$listeners, {
          input(event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `<label>{{label}}:
  <input v-bind="$attrs"
    v-bind:value="value"
    v-on="inputListeners"/>
  </label>
  `
})
Vue.component('baseCheckbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: { checked: Boolean },
  template: `
    <input type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)">
  `
})
Vue.component('grocery-item', {
  props: ['grocery'],
  template: '<li class="active">{{grocery.text}}</li>'
})
Vue.component('todo-item', {
  props: ['title', 'type'],
  template: '\
  <li>\
    {{title}}\
    <button v-if="type===\'deleted\'" @click="$emit(\'add\')">Add</button>\
    <button v-else @click="$emit(\'remove\')">Remove</button>\
  </li>\
  '
})
let counter = Vue.component('button-counter', {
  props: ['text'],
  data() {
    console.log('text', this.text, this.$options)
    return {
      count: 0
    }
  },
  template: `<div>
    <button @click="count = count + 1" >{{text}} {{count}} times.</button>
    <button v-if="text == 'Clicked'" @click="$emit('enlarge-text', 0.1)">Enlarge Size</button>
  </div>`
})

Vue.component('blog-post', {
  props: ['post'],
  template: `<div class="blog-post">
      <h3>{{post.title}}</h3>
      <div v-html="post.content"></div>
      <p>post time: {{post.datetime}}</p>
      <button-counter text="Touched"></button-counter>
    </div>`
})
Vue.component('custom-input', {
  props: ['value'],
  template: `<div> Custom Input:
    <input :value="value"
      @input="$emit('input', $event.target.value)">
  </div>`
})
Vue.component('alert-box', {
  template: `<div class="demo-alert-box">
    <strong>Error!</strong>
    <slot>Noooooop</slot>
  </div>`
})
Vue.component('navigation-link', {
  props: ['user'],
  template: `<p>
    <a :href="$attrs.url" class="nav-link">
      <slot name="linktext" :url="$attrs.url">Here might be a link {{$attrs.url}}</slot>
    </a>
    <span>[user: <slot name="myinfo" :user="user">{{user.firstName}}</slot>]</span>
    <slot>Here might be a input</slot>
  </p>`
})
Vue.component('current-user', {
  template:  `<div>Current User:

  </div>`
})
Vue.component('tab', { template: `<button><slot></slot></button>`} )
Vue.component('TabHome', {template: `<input value="Home Component"/>`})
Vue.component('TabPosts', {template: `<input value="Posts Component"/>`})
Vue.component('TabArchive', {template: `<input value="Archive Component"/>`})

let groceries = [
  { id: 0, text: '蔬菜' },
  { id: 1, text: '奶酪' },
  { id: 2, text: '随便其它什么人吃的东西' }
];
Object.freeze(groceries);
// Object.keys(vm) = ["_uid", "_isVue", "$options", "_renderProxy", "_self", "$parent", "$root", "$children", "$refs", "_watcher", "_inactive", "_directInactive", "_isMounted", "_isDestroyed", "_isBeingDestroyed", "_events", "_hasHookEvent", "_vnode", "_staticTrees", "$vnode", "$slots", "$scopedSlots", "_c", "$createElement", "$attrs", "$listeners", "_watchers", "reverseMessage", "_data", "title", "message", "groceryList", "todos", "seen", "$el"]
let vm = new Vue({
  el: '#app',
  data: {
    dynamicslotname: 'myinfo',
    user: {
      firstName: 'Zhou',
      lastName: 'Fengying'
    },
    normalInput: 'my input',
    currentTabComponent: 'TabHome',
    customText: '',
    postFontSize: 1,
    textareaValue: '',
    checkbox1: undefined,
    checkbox2: false,
    radio1: false,
    radio2: false,
    select1: 'A',
    checkboxList: [],
    radioList: [],
    selectList: [],
    posts: [
      { id: 1, title: 'My journey with Vue', datetime: new Date() },
      { id: 2, title: 'Blogging with Vue', datetime: new Date() },
      { id: 3, title: 'Why Vue is so fun', datetime: new Date() }
    ],
    todos: [
      { id: 1, title: 'Do the Dishes', type: ''},
      { id: 2, title: 'Take a shower', type: ''}
    ],
    todosRemoved: [],
    nextTodoId: 3,
    newTodoText: '',
    seen: true,
    activeColor: 'blue',
    fontSize: 20,
    activeClass: 'active',
    errorClass: 'error',
    baseStyles: { color: 'blue', transform: 'rotate(0.5turn)' },
    overridingStyles: { color: 'pink', fontSize: '21px', transform: 'scale(1.5, 3)' },
    isActive: true,
    hasError: false,
    loginType: 'email',
    listMsg: 'We hide the groceryList',
    question: '',
    answer: 'I cannot give you an answer until you ask a question!',
    answerImg: 'https://yesno.wtf/assets/no/0-b6d3e555af2c09094def76cf2fbddf46.gif',
    groceryList: groceries,
    attributehref: 'href', // when it's null, will remove the bind
    indexUrl: '/',
    isButtonDisabled: null, // only null false undefined == false
    // isButtonDisabled: '', // only null false undefined == false
    rawHtml: '<div style="color:red">raw HTML</div>',
    message: 'Fanny You Gonna Make It! ' + new Date().toLocaleString(),
    title2: 'listening title',
    title: 'TRANSLATIONS LIST'
  },
  beforeCreate() {},
  created() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: { // 无缓存 需要实时更新时使用
    switchTab(tabName) {
      this.currentTabComponent = 'Tab'+ tabName
      log('switchTab', tabName, this.currentTabComponent)
    },
    addNewTodo() {
      if(!this.newTodoText)
        return
      let newItem = {
        type: '',
        id: this.nextTodoId++,
        title: this.newTodoText
      }
      this.newTodoText = ''
      this.todos.push(newItem)
    },
    removeTodo(index){
      let deletedItem = this.todos.splice(index, 1)[0]
      deletedItem.type = 'deleted'
      this.todosRemoved.push(deletedItem)
      log(this.todosRemoved)
    },
    reverseTitle(event, dollar_event) {
      // if(event)
      //   log('event', event, event.path[0], event.target === event.path[0], event.target === document.getElementById('reverseBtn'))
      // if (dollar_event)
      //   log('dollar_event', dollar_event, dollar_event.path, dollar_event.target === document.getElementById('reverseBtn'))
      this.title = this.title.split('').reverse().join('');
    },
    clickTitleInput(event) {
      if(event) {
        // log('clickTitleInput', event)
        event.target.style.color = 'red'
      }
    },
    blurTitleInput(event) {
      if(event) {
        // log('blurTitleInput', event)
        event.target.style.color = 'black'
      }
    },
    rightTitleInput(event) {
      if(event) {
        // log('rightTitleInput', event)
        event.target.style.color = 'blue'
      }
    },
    getAnswer() {
      if(!this.question.includes('?')) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'// 设置中间状态
      var vm = this
      axios.get('https://yesno.wtf/api')
      .then(res => {
        log('res', res)
        vm.answer = _.capitalize(res.data.answer)
        vm.answerImg = _.capitalize(res.data.image)
      })
      .catch(err => {
        vm.answer = 'Error! You could not reach the API: ' + error
      })
    }
  },
  computed: { // 有缓存 大量计算时使用 只在相关响应式依赖发生改变时它们才会重新求值
    now() {
      return Date(Date.now()).toLocaleString()
    },
    styleObject() {
      return {
        color: this.activeColor,
        fontSize: this.fontSize + 'px'
      }
    },
    classObject() {
      return {
        active: this.isActive && !this.hasError,
        error: this.hasError
      }
    },
    reversedTitle: {
      get() {
        return this.title.split('').reverse().join('')
      },
      set(val) {
        this.title = val + '-launaM'
      }
    }
  },
  /* vm.$watch('answer', function() {console.log(vm.title)})
  会添加到 vm._watchers list里面 */
  watch: {
    title(val) {
      this.title2 = val + '!!!(I am watching you...)'
    },
    question(newV, oldV) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  }
})

