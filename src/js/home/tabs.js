{
  let view = {
    el: '#tabs',
    init() {
      this.$el = $(this.el)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', 'ul > li >.navWrapper', (e) => {
        let $li = $(e.currentTarget)
        let pageName = $li.parent().attr('data-tab-name')
        
        this.view.$el.find('ul > li >.navWrapper').removeClass('active')
        $li.addClass('active')

        window.eventHub.triger('selectTab', pageName)
      })
    }
  }
  controller.init(view, model)
}