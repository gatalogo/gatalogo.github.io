// Reveals elements as they scroll into view and drives the screenshot carousel arrows.
;(function () {
  var items = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('in')
    })
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    items.forEach(function (el) {
      observer.observe(el)
    })
  }

  var track = document.querySelector('.phones')
  var buttons = document.querySelectorAll('.nav-btn')
  if (!track || !buttons.length) return
  var update = function () {
    var max = track.scrollWidth - track.clientWidth - 2
    buttons[0].disabled = track.scrollLeft <= 2
    buttons[1].disabled = track.scrollLeft >= max
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var step = track.clientWidth * 0.9
      track.scrollBy({ left: Number(button.dataset.dir) * step, behavior: 'smooth' })
    })
  })
  track.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
})()
