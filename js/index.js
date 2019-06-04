$(function(){
    /*动态响应式轮播图*/
    banner()
})

/*动态响应式轮播图*/
function banner(){
     /*
     *1.获取后台的轮播路  图片数据   （ajax）
     *2.需要判断当前的屏幕是移动端和是非移动端  （屏幕的宽度 768px以下都是移动端）
     *3.把后台数据渲染成对应的html字符串 （字符串拼接 & 模板引擎 artTemplate native-template）
     *   underscore 介绍和学习
     *4.把渲染完成的html填充在对应的盒子里面  也就是完成了页面渲染 （渲染到页面当中 .html()）
     *5.在屏幕尺寸改变的时候需要重新渲染页面 (监听页面尺寸的改变 resize)
     *6.在移动端需要 通过手势来控制图片的轮播 左 next 右的 prev  滑动
     * */

    /*申明全局的变量  接受数据  缓存在内存当中*/
    var myData = null

    /*1.获取后台的轮播路  图片数据   （ajax）*/
    var getData = function(callback){
        if (myData) {
            callback && callback(myData)

            return false
        }

        $.ajax({
            /*
             * js是被html引用的
             * 发出的请求是相对于html
             * html相对于 index.json  多了一层 js 文件夹
             * 相对路径的话 还需要加目录
             * */
            url:'js/index.json',
            type:'get',
            dataType:'json',
            success:function(data){
                /*
                * 当我们已经请求成功之后  把数据缓存在内存当中
                * 当下次调用这个方法的时候  去判断内存当中有没有记录这个数据
                * 如果有记录  直接返回内存当中的
                * 如果没有  再做请求
                * */
               myData = data

               callback && callback(myData)
            }
        })
    }

    /*渲染的方法*/
    /*
     *2.需要判断当前的屏幕是移动端和是非移动端  （屏幕的宽度 768px以下都是移动端）
     *3.把后台数据渲染成对应的html字符串 （字符串拼接 & 模板引擎 artTemplate native-template）
     *4.把渲染完成的html填充在对应的盒子里面  也就是完成了页面渲染 （渲染到页面当中 .html()）
     * */
    var renderHtml = function(){
        /*获取到数据*/
        getData(function(data){
            /*请求结束  获取数据 完成  之后去干这些事情*/
            /*当前屏幕的宽度*/
            var width = $(window).width()
            /*是否移动端*/
            var isMobile = false
            if (width < 768) {
                isMobile = true
            }

            /*准备需要解析的数据*/
            /*我们需要两个模板*/
            /*点的模板对象*/
            var pointObj = _.template($("#dotId").html())
            var imgObj = _.template($("#imgItem").html())
            
            /*渲染成html字符  解析成html*/
            /*传入数据  根据模板解析  返回html字符*/
            /*{model:data}  传入的数据  名字叫model 数据是data*/
            var pointHTML = pointObj({model:data})
            var imgHTML = imgObj({
                model:{
                    list:data,
                    isMobile
                }
            })
            
            /*渲染页面*/
            $(".carousel-indicators").html(pointHTML)
            $(".carousel-inner").html(imgHTML)
        })
    }

    /*5.在屏幕尺寸改变的时候需要重新渲染页面 (监听页面尺寸的改变 resize)*/
    $(window).on('resize',function(){
        /*渲染*/
        renderHtml()
    }).trigger('resize')
}

