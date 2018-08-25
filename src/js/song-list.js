{
  let view = {
    el: '#songList-container',
    template: `
    <ul class="songList">
     </ul>`,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let songs = data.songs
      let liList = songs.map((song) => {
        let li = $('<li></li>')
        li.text(song.name + '-' + song.singer).attr('data-id', song.id)
        return li
      })
      $el.find('ul').empty()

      liList.map((domLi) => {
        $el.find('ul').append(domLi)
      })
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    },
    activeItem(li) {
      let $li = $(li)
      $li.addClass('active').siblings('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query('Song');
      return query.find().then((Song) => {
        // 成功获得实例
        // Song 就是 Song 的对象实例
        let songs = Song.map((song) => {
          return {
            id: song.id,
            ...song.attributes
          }
        })
        this.data.songs = songs
        return songs
      });
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEventHub()
      this.bindEvents()
      this.getAllSongs()
    },
    getAllSongs() {
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents(e) {
      $(this.view.el).on('click', 'li', (e) => {
        this.view.activeItem(e.currentTarget)
        let songId = e.currentTarget.getAttribute('data-id')
        window.eventHub.triger('select', songId)
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}