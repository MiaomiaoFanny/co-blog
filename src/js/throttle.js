  /* 节流 与 防抖 Fannia！*/
{
  const {log:ll, error, dir, table, debug} = console;
  ll('in throttle.js');

  let throttle_try_count = 0;
  let throttle_exec_count = 0
  let debounce_try_count = 0;
  let debounce_exec_count = 0;;
  let both_try_count = 0;
  let both_exec_count = 0;


  var text = `取决于最后一次, 在最后一次动作停止后 开始延迟 delay之后执行\
    场景: 滚动、 窗口大小调整或按下键等事件 `
  function debounce(fn, delay) {
    // let in_timeout = false;
    let timer = null;
    return function() {
      document.querySelector('#debounce_try_count').innerText = `try to scrolle ${debounce_try_count++} times, random number: ${arguments[0]}`
      let context = this;
      let args = arguments;
      // if( in_timeout ) {
      if( timer ) {
          clearTimeout(timer)
      }
      // in_timeout = true
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null;
        // in_timeout = false
      }, delay);
    }
  }

  var text = `取决于第一次, 在第一次动作执行后, 之后的delay事件都休息, delay之后如果有动作就执行, 如果是连续的会以delay的时间间隔执行 \
    一次delay间隔内, 可以在开始时执行, 也可以在开始后执行, 如果有传值, 需要考虑值得及时性(得到的是不是执行这个时刻的真实值, 而不是之前传过来的值)`

  function throttle2(fn, delay) {
    let in_timeout = false;
    return function () {
      let context = this;
      let args = arguments;
      document.querySelector('#throttle_try_count').innerText = `try to scrolle ${throttle_try_count++} times, random number: ${arguments[0]}`
      if (!in_timeout) {
        // fn.apply(context, args) // 若在次执行则每次在计时之前执行(立即执行后计时)
        in_timeout = true
        setTimeout(() => {
          fn.apply(context, args) // 若在此调用则每次计时之后执行(延迟执行)
          in_timeout = false
        }, delay);
      }
    }
  }
  function throttle(fn, delay) {
    let last = 0;
    return function () { // 不能使用箭头函数, 箭头函数取不到arguments
      document.querySelector('#throttle_try_count').innerText = `try to scrolle ${throttle_try_count++} times, , random number: ${arguments[0]}`
      let now = +new Date()
      let context = this;
      let args = arguments;
      if (now - last >= delay) {
        fn.apply(context, args)
        last = now // 执行之后立即重新开始计时, 相当于(立即执行后计时)
      }
    }
  }

  function throttle_debounce(fn, delay) {
    let last = 0; // 上次触发回调的时间
    let timer = null; // 定时器
    return function () { // 不能使用箭头函数, 箭头函数取不到arguments
      document.querySelector('#both_try_count').innerText = `try to scrolle ${both_try_count++} times, random number: ${arguments[0]}`
      let now = +new Date()
      let context = this;
      let args = arguments;
      if (now - last >= delay) { // 时间到啦
        clearTimeout(timer) // 把上次的时间间隔太小时定的定时器撤掉, 否则会出现上次定时到点了和这次只相隔0.0000x秒执行
        fn.apply(context, args) // 时间到就不等了, 去执行吧
        last = now // 执行之后立即重新开始计时, 相当于(立即执行后计时)
      } else { // 时间没到
        clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(context, args)
          last = now
        }, delay);
      }
    }
  }
  function throttle_scroll() {
    document.querySelector('#throttle_exec_count').innerText = `actually scrolled ${throttle_exec_count++} times, random number: ${arguments[0]}`
    ll('do throttle_scroll!!!!!!!!!!', throttle_exec_count)
  }

  function debounce_scroll() {
    document.querySelector('#debounce_exec_count').innerText = `actually scrolled ${debounce_exec_count++} times, random number: ${arguments[0]}`
    ll('do debounce_scroll!!!!!!!!!!', debounce_exec_count)
  }

  function both_scroll() {
    document.querySelector('#both_exec_count').innerText = `actually scrolled ${both_exec_count++} times, random number: ${arguments[0]}`
    ll('do both_scroll!!!!!!!!!!', both_exec_count)
  }
  // const better_throttle_scroll = throttle2(throttle_scroll, 1000)
  const better_throttle_scroll = throttle(throttle_scroll, 1000)
  const better_debounce_scroll = debounce(debounce_scroll, 1000)
  const better_throttle_debounce_scroll = throttle_debounce(both_scroll, 1000)
  if (document.querySelector('#both_exec_count')) {
    document.addEventListener('scroll', () => { better_throttle_scroll(Math.random() * 10) })
    document.addEventListener('scroll', () => { better_debounce_scroll(Math.random() * 10) })
    document.addEventListener('scroll', () => { better_throttle_debounce_scroll(Math.random() * 10) })
  }
}