{
  let view = {
    el: '#app',
    template: `
    <audio src={{url}}></audio>`,
    render(data) {
      $(this.el).append(this.template.replace('{{url}}', data.url))
    },
    play() {
      let audio = $(this.el).find('audio')[0]
      console.log($(this.el).find('audio'))
      audio.play()
    },
    pause() {
      let audio = $(this.el).find('audio')[0]
      console.log($(this.el).find('audio'))
      audio.pause()
    }
  }

  let model = {
    data: {
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    setId(id) {
      this.data.id = id
    },
    get() {
      var query = new AV.Query('Song')
      return query.get(this.data.id).then((song) => {
        // 成功获得实例
        Object.assign(this.data, song.attributes)
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
      this.model.setId(id)
      this.model.get().then(() => {
        console.log(this.model.data)
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.play', () => {
        this.view.play()
      })
      $(this.view.el).on('click', '.pause', () => {
        this.view.pause()
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