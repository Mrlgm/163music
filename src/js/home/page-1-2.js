{
  let view = {
    el: '#newSong',
    template: `
    <li>
    <a href="./song.html?id={{song.id}}">
      <div class="Song">
        <div class="songName">{{song.name}}</div>
        <div class="singer">{{song.singer}}</div>
      </div>
      <div class="playSong">
        <img src="./img/播放.png" alt="按钮">
      </div>
    </a>
  </li>`,
    init() {
      this.$el = $(this.el)
    },
    render(data) {
      let songs = data.songs
      songs.map((song) => {
        let $li = $(this.template
          .replace('{{song.id}}', song.id)
          .replace('{{song.name}}', song.name)
          .replace('{{song.singer}}', song.singer)
        )

        this.$el.find('ol').append($li)
      })

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
          return Object.assign({
            id: song.id,
          }, song.attributes)
        })
        this.data.songs = songs
        return songs
      });
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}