/**
 * Created by Administrator on 2016/9/22 0022.
 * 首页核心js
 *
 */
$(function () {
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul>li").removeClass("current");
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    })
    //添加样式
    $(".baseUI>li>ul>li").off("click");
    $(".baseUI>li>ul>li").on("click",function () {
        $(this).addClass("current")
            .siblings()
            .removeClass("current");
    })

    $(".baseUI>li>ul").slideUp();
    //模拟点击第一个a标签
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");

})
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    .controller("mainCtrl",["$scope",function ($scope) {
        
    }])
    .config(["$routeProvider",function ($routeProvider) {
        /*
        * a方向id
        * b 难度id
        * c知识点id
        * d 类型id
        * */
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            //题目的筛选
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/PaperList",{
            //试卷列表遍历
            templateUrl:"tpl/paper/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            //给试题传送参数比如加入购物车就得把该商品的参数通过路由传送到购物车
            templateUrl:"tpl/paper/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperSubjectList",{
            //添加试题遍历
            templateUrl:"tpl/paper/paper/subjectList.html",
            controller:"subjectController"
        })
}])
