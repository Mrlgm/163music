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
      let selectedSongId = data.selectedSongId
      let liList = songs.map((song) => {
        let $li = $('<li></li>').text(song.name + '-' + song.singer).attr('data-id', song.id)
        if(song.id === selectedSongId){
          $li.addClass('active')
        }
        return $li
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
      songs: [],
      selectedSongId: undefined
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
        let songId = e.currentTarget.getAttribute('data-id')

        this.model.data.selectedSongId = songId
        this.view.render(this.model.data)

        let data
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
        let object = JSON.parse(JSON.stringify(data)) //深拷贝，避免修改了地址

        window.eventHub.triger('select', object)
      })
    },
    bindEventHub() {
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', () => {
        this.view.clearActive()
      })
      window.eventHub.on('updata', (song) => {
        console.log('cccccccc')
        console.log(song)
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === song.id) {
            Object.assign(songs[i], song)
          }
        }
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}