// ==UserScript==
// @name         SwitchGPA
// @namespace    http://ustcdos.club
// @version      0.2.1
// @description  Hide the minor grades
// @author       EnsZhou
// @match        *://jw.ustc.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @resource     tg-css file:///D:/Dev/chrome-plugin/tmepermonkey/toggle.css
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      file:///D:/Dev/chrome-plugin/tmepermonkey/toggle.js

// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //console.log('script is running>>>');
    var times = 0;
    var hide_id = ['016S15', '016S02', '016S03'];


    var tg_css = GM_getResourceText("tg-css");
    GM_addStyle(tg_css);


    //var sw = '<div class="container"><form class="toggle"><input type="radio" id="choice1" name="choice" value="creative"><label for="choice1">总成绩</label><input type="radio" id="choice2" name="choice" value="productive"><label for="choice2">主修成绩</label><div id="flap"><span class="content">productive</span></div></form></div>';
    var tg_str = `<div class="tg-container">
    <form class="toggle">

        <input type="radio" id="choice1" name="choice" value="creative">
        <label for="choice1">总成绩</label>

        <input type="radio" id="choice2" name="choice" value="productive">
        <label for="choice2">主修成绩</label>

        <div id="flap"><span class="tg-content">productive</span></div>
    </form>
</div>`;
    $(".showFailed").append(tg_str);


    var state_global = false;



    setTimeout(() => {
        var callback = function (records) {
            //console.log('change');
            setTimeout(hide_show, 100);
        };

        var mo = new MutationObserver(callback);


        var slider_marks = $('.vue-slider-mark');
        var slider_dot_handles = $('.vue-slider-dot-handle');
        //console.log(slider_dot_handles);
        var options = {
            'attributes': true
        };
        for (var i = 0; i < slider_marks.length; i++) {
            mo.observe(slider_marks[i], options);
        }
        if (slider_dot_handles.length > 0) {
            mo.observe(slider_dot_handles[0], options);
            mo.observe(slider_dot_handles[1], options);
        }
    }, 500);




    /*$("[name='my-checkbox']").bootstrapSwitch({
        onText: '主修成绩',
        offText: '总成绩',
        offColor: 'info',
        labelText: '>>>',
        onSwitchChange: function (event, state) {
            state_global = state;
            hide_show();
        }
    });*/




    function hide_show(event, state) {
        times++;
        //console.log(times + '\nhide_show');


        var course_id = $('.course-name').children('small');
        var i, j;
        var match = false;
        for (i = 0; i < course_id.length; i++) {
            for (j = 0; j < hide_id.length; j++) {
                if (course_id.eq(i).text() == hide_id[j]) {
                    match = true;
                    break;
                }
            }

            if (state_global == true) {
                $('.bootstrap-switch-label').text('<<<');
                if (match == true) {
                    course_id.eq(i).parent().parent().hide();
                    course_id.eq(i).parent().parent().attr('name', 'sw-hide');
                }
                else {
                    course_id.eq(i).parent().parent().show();
                    course_id.eq(i).parent().parent().attr('name', 'sw-show');
                }
            }
            else {
                $('.bootstrap-switch-label').text('>>>');
                course_id.eq(i).parent().parent().show();
                course_id.eq(i).parent().parent().attr('name', 'sw-show');
            }
            match = false;

        }

        calculate_gpa();
    }



    function calculate_gpa() {
        var courses = $('.course-name').parent();
        var course, info;
        var point, grade, credit, gpa, weight_average, average;
        var sum_credit, sum_credit1, sum_credit2, sum1, sum2, sum_point, sum_point_courses;
        sum_credit = 0;
        sum_credit1 = 0;
        sum_credit2 = 0;
        sum_point = 0;
        sum_point_courses = 0;
        sum1 = 0;
        sum2 = 0;
        for (var i = 0; i < courses.length; i++) {
            course = courses.eq(i);
            if (course.attr('name') == 'sw-hide')
                continue;
            info = course.children();
            credit = parseFloat(info[2].textContent);
            grade = parseFloat(info[3].textContent);
            point = parseFloat(info[4].textContent);
            if (!isNaN(grade)) {
                sum_credit1 += credit;
                sum1 += grade * credit;
                switch (info[4].textContent) {
                    case 'A+': point = 97.5;
                        break;
                    case 'A': point = 92;
                        break;
                    case 'A-': point = 87;
                        break;
                    case 'B+': point = 84;
                        break;
                    case 'B': point = 79.5;
                        break;
                    case 'B-': point = 75;
                        break;
                    default: point = parseFloat(info[4].textContent);
                        break;
                }
                sum_point += point;
                sum_point_courses++;
                sum_credit2 += credit;
                sum2 += point * credit;
            }
            sum_credit += credit;
        }
        gpa = sum1 / sum_credit1;
        weight_average = sum2 / sum_credit2;
        average = sum_point / sum_point_courses;
        var items = $('.overview').children().children();
        items.eq(0).children().eq(1).text(sum_credit);
        items.eq(1).children().eq(1).text(sum_credit);
        items.eq(2).children().eq(1).text(0);
        items.eq(3).children().eq(1).text(gpa.toFixed(2));
        items.eq(4).children().eq(1).text(weight_average.toFixed(2));
        items.eq(5).children().eq(1).text(average.toFixed(2));
    }





})();