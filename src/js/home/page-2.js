{
  let view = {
    el: '.page2',
    init() {
      this.$el = $(this.el)
    },
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEventHub()
    },
    bindEventHub() {
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page2'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }
  controller.init(view, model)
}