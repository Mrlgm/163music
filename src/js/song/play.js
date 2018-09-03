{
  let view = {
    el: '#app',
    render(data) {
      let {
        song,
        status
      } = data
      console.log(status)
      $(this.el).css('background-image', `url(${song.cover})`)
      $(this.el).find('img.cover').attr('src', song.cover)
      if ($(this.el).find('audio').attr('src') !== song.url) {
        let audio = $(this.el).find('audio').attr('src', song.url).get(0)
        audio.onended = () => {
          window.eventHub.triger('ended')
        }
        audio.ontimeupdate = () => {
          this.showLyric(audio.currentTime)
        }
      }
      if (status === 'playing') {
        $(this.el).find('.disc-container').addClass('playing')
      } else {
        $(this.el).find('.disc-container').removeClass('playing')
      }
      $(this.el).find('.song-description>h1').text(song.name)
      let {
        lyric
      } = song
      let array = lyric.split('\n').map((string) => {
        let p = document.createElement('p')
        let regex = /\[([\d:.]+)\](.+)/
        let matches = string.match(regex)
        if (matches) {
          p.textContent = matches[2]
          let time = matches[1]
          let parts = time.split(':')
          let minutes = parts[0]
          let seconds = parts[1]
          let newTime = parseInt(minutes, 10) * 60 + parseFloat(seconds, 10)
          p.setAttribute('data-time', newTime)
        } else {
          p.textContent = string
        }
        $(this.el).find('.lyric>.lines').append(p)
      })

    },
    play() {
      $(this.el).find('audio')[0].play()

    },
    pause() {
      $(this.el).find('audio')[0].pause()

    },
    showLyric(time) {
      let allP = $(this.el).find('.lyric>.lines>p')
      let p
      for (let i = 0; i < allP.length; i++) {
        if (i === allP.length - 1) {
          p = allP[i]
          break
        } else {
          let currentTime = allP[i].getAttribute('data-time')
          let nextTime = allP[i + 1].getAttribute('data-time')
          if (currentTime <= time && nextTime > time) {
            p = allP[i]
            break
          }
        }
      }
      let height = p.getBoundingClientRect().top - $(this.el).find('.lyric>.lines')[0].getBoundingClientRect().top
      $(this.el).find('.lyric>.lines').css('transform', `translateY(${-(height-25)}px)`)
      $(p).addClass('active').siblings('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: ''
      },
      status: 'paused'
    },
    get(id) {
      var query = new AV.Query('Song')
      return query.get(id).then((song) => {
        // 成功获得实例
        Object.assign(this.data.song, song.attributes)
        return song
      }, function (error) {
        // 异常处理
      })
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then(() => {
        this.view.render(this.model.data)
        //this.view.play()
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.icon-play', () => {
        this.model.data.status = 'playing'
        this.view.render(this.model.data)
        this.view.play()
      })
      $(this.view.el).on('click', '.icon-pause', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
        this.view.pause()
      })
      window.eventHub.on('ended', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
      })
    },
    getSongId() {
      let search = window.location.search

      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }
      let array = search.split('&').filter(v => v)
      let id = ''

      for (let i = 0; i < array.length; i++) {
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if (key === 'id') {
          id = value
          break
        }
      }
      return id
    }
  }
  controller.init(view, model)
}