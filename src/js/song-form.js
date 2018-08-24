{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <h1>新建歌曲</h1>
    <form class="form">
      <div class="row">
        <label>
          歌名
        </label>
        <input name="name" type="text" value="__name__">
      </div>
      <div class="row">
        <label>
          歌手
        </label>
        <input name="singer" type="text" value="__singer__">
      </div>
      <div class="row">
        <label>
          外链
        </label>
        <input name="url" type="text" value="__url__">
      </div>
      <div class="row actions">
        <button type="submit">保存</button>
      </div>
    </form>`,
    render(data = {}) {
      let placeholders = ['name', 'url', 'singer', 'id']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    },
    reset() {
      this.render({})
    }
  }
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    create(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      return song.save({
        name: data.name,
        singer: data.singer,
        url: data.url
      }).then((newSong) => {
        let id = newSong.id
        let attributes = newSong.attributes
        this.data = {id, ...attributes}
      }, (error) => {
        console.log(error)
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data) => {
        this.view.render(data)
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val()
        })
        this.model.create(data).then(() => {
          console.log(this.model.data)
          this.view.reset()
          window.eventHub.triger('create', this.model.data)
        })
      })
    }
  }

  controller.init(view, model)
}