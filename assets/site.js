// Reveals elements as they scroll into view, plays the promo video only while it is on screen,
// and drives the screenshot carousel arrows.
;(function () {
  clearTimeout(window.__revealFallback)
  var root = document.documentElement
  var items = document.querySelectorAll('.reveal')
  var video = document.querySelector('.video-frame video')

  if (!('IntersectionObserver' in window)) {
    root.classList.add('reveal-all')
    if (video) video.setAttribute('autoplay', '')
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

    if (video) {
      // Downloads and plays only when visible, so the page loads fast on mobile data.
      var userPaused = false
      video.addEventListener('pause', function () {
        if (!video.dataset.auto) userPaused = true
        delete video.dataset.auto
      })
      video.addEventListener('play', function () {
        userPaused = false
      })
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !userPaused) {
              var playing = video.play()
              if (playing && playing.catch) playing.catch(function () {})
            } else if (!entry.isIntersecting && !video.paused) {
              video.dataset.auto = '1'
              video.pause()
            }
          })
        },
        { threshold: 0.35 },
      ).observe(video)
    }
  }

  // Cycles the hero tagline through what the app can do, like the splash text in the app header.
  var tagline = document.querySelector('.tagline-text')
  var phrases = []
  try {
    phrases = JSON.parse((tagline && tagline.dataset.phrases) || '[]')
  } catch (e) {}
  if (tagline && phrases.length > 1) {
    var phraseIndex = 0
    setInterval(function () {
      if (document.hidden) return
      tagline.classList.add('is-out')
      setTimeout(function () {
        phraseIndex = (phraseIndex + 1) % phrases.length
        tagline.textContent = phrases[phraseIndex]
        tagline.classList.remove('is-out')
        tagline.classList.add('is-in')
        void tagline.offsetWidth
        tagline.classList.remove('is-in')
      }, 350)
    }, 3200)
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
