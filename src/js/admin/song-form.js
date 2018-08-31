{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
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
      <div class="row">
        <label>
          封面
        </label>
        <input name="cover" type="text" value="__cover__">
      </div>
      <div class="row actions">
        <button type="submit">保存</button>
      </div>
    </form>`,
    render(data = {}) {
      let placeholders = ['name', 'url', 'singer', 'id', 'cover']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
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
      id: '',
      cover: ''
    },
    create(data) {
      let Song = AV.Object.extend('Song');
      let song = new Song();

      return song.save({
        name: data.name,
        singer: data.singer,
        url: data.url,
        cover: data.cover
      }).then((newSong) => {
        let id = newSong.id
        let attributes = newSong.attributes
        this.data = {
          id,
          ...attributes
        }
      }, (error) => {
        console.log(error)
      })
    },
    updata(data) { //卧槽，坑爹的文档，代码创建和手动创建的权限不一样
      // 第一个参数是 className，第二个参数是 objectId
      let Song = AV.Object.createWithoutData('Song', this.data.id);
      // 修改属性
      // 保存到云端
      return Song.save({
        singer: data.singer,
        name: data.name,
        url: data.url,
        cover: data.cover
      }).then((response) => {
        console.log(response)
        Object.assign(this.data, data)
        return response
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

      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', (data) => {
        data = data || {}
        if (this.model.data.id) {
          this.model.data = {}
        } else {
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    create() {
      let needs = 'name singer url cover'.split(' ')
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.create(data).then(() => {
        this.view.reset()
        window.eventHub.triger('create', this.model.data)
      })
    },
    updata() {
      let needs = 'name singer url cover'.split(' ')
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.updata(data).then(() => {
        window.eventHub.triger('updata', JSON.parse(JSON.stringify(this.model.data)))
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          this.updata()
        } else {
          this.create()
        }
      })
    }
  }

  controller.init(view, model)
}