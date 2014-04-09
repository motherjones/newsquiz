/*! newsquiz - v0.1.0 - 2014-02-20 
* https://github.com/motherjones/newsquiz
* Copyright (c) 2014 Ben Breedlove; Licensed MIT, GPL */
/*global jQuery:false,Tabletop:false,console:false*/
(function($) {

    function make_default_how_you_did_html(nCorrect, nQuestions) {
        var answersWord = nCorrect === 1 ? 'answer' : 'answers';
        return 'You got <span class="correct_answers">' + nCorrect + '</span> ' +
               'correct ' + answersWord + ' out of ' + nQuestions + ' questions';
    }

    function make_default_how_you_did_htmls(nQuestions) {
        var ret = [];
        for (var i = 0; i <= nQuestions; i++) {
            ret.push(make_default_how_you_did_html(i, nQuestions));
        }
        return ret;
    }

    $.quiz = function(quiz_data, results_data, options) {
        var container_elem;
        var self;
        var cover;
        var cheater_answer_tracking = [];
        var answer_tracking = [];
        var how_you_did_element;

        var quiz = {
            defaulting_behavior_on : true,
            defaulting_flag : '!default',
            container : 'quiz_container',
            not_finished_html : undefined,
            cheating : false,
            possible_display_elements  : [
                { 
                    name : 'backgroundimage',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $('<div class="' +
                            this.name +
                            '" style="background-image: url(\'' +
                            slide[this.name] +
                            '\'); height: 100%; width: 100%;position:absolute;z-index: -1"></div>'
                        );
                    } 
                },
                { 
                    name : 'topimage',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $(
                                '<img src="' + slide[this.name]  +
                                '" class="' + this.name + '"></img>' 
                        );
                    } 
                },
                { 
                    name : 'topvideoembed',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    needs_aspect_ratio : true,
                    create_element : function(slide) {
                         //check aspect ratio
                        if (!slide.topvideoembedaspectratio) {return '';}
                        return $('<div class="videoembed ' + this.name +
                            '" style="padding-bottom:' +
                            slide.topvideoembedaspectratio + '%">' +
                            slide[this.name] + '</div>'
                        );
                    } 
                },
                { 
                    name : 'title',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $('<h1 class="' + this.name + '">' +
                            slide[this.name] + '</h1>' 
                        );
                    } 
                },
                { 
                    name : 'middleimage',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $(
                                '<img src="' + slide[this.name] +
                                '" class="' + this.name + '"></img>' 
                        );
                    } 
                },
                { 
                    name : 'middlevideoembed',
                    needs_aspect_ratio : true,
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                         //check aspect ratio
                        if (!slide.middlevideoembedaspectratio) {return '';}
                        return $('<div class="videoembed ' + this.name +
                            '" style="padding-bottom:' +
                            slide.middlevideoembedaspectratio + '%">' +
                            slide[this.name] + '</div>'
                        );
                    } 
                },
                { 
                    name : 'subhed',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $('<h2 class="' +
                            this.name +
                            '">' +
                            slide[this.name] +
                            '</h2>'
                        );
                    } 
                },
                { 
                    name : 'text',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $('<p class="' +
                            this.name +
                            '">' +
                            slide[this.name] +
                            '</p>'
                        );
                    } 
                },
                { 
                    name : 'bottomimage',
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                        if (!slide[this.name]) {return '';}
                        return $('<img src="' + slide[this.name] +
                            '" class="' + this.name + '"></img>' 
                        );
                    } 
                },
                { 
                    name : 'bottomvideoembed',
                    needs_aspect_ratio : true,
                    finder: function(container) {
                        return container.find('.' + this.name);
                    },
                    create_element : function(slide) {
                         //check aspect ratio
                        if (!slide.bottomvideoembedaspectratio) {return '';}
                        return $('<div class="videoembed ' + this.name +
                            '" style="padding-bottom:' +
                            slide.bottomvideoembedaspectratio + '%">' +
                            slide[this.name] + '</div>'
                        );
                    } 
                }
            ],

            init : function(quiz_data, results_data, options) {
                self = this;

                if (options) {
                    for ( var option in options ) {
                        self[option] = options[option];
                    }
                }

                if (typeof(quiz_data) === 'string') {
                    // is a google spreadsheet.
                    // Will call init_data in a callback
                    self.load_from_google_spreadsheet(quiz_data);
                } else {
                    if (!results_data) {
                        results_data = make_default_how_you_did_htmls(quiz_data.length);
                    }

                    self.init_data(quiz_data, results_data);
                }

                return self;
            },
            init_data: function(quiz_data, results_data) {
                self.quiz_data = quiz_data;
                self.results_data = results_data;

                self.calculate_aspectratios(quiz_data);
                self.create_cover();

                for ( var i = 0; i < self.quiz_data.length; i++ ) {
                    self.append_question(i);
                }

                self.append_how_you_did_section();
                self.update_how_you_did_element();
            },
            append_how_you_did_section: function() {
                how_you_did_element = $('<p class="how_you_did"></p>');
                cover.append(how_you_did_element);
            },

            load_from_google_spreadsheet: function(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback: function(data) {
                        var quiz_data = self.make_quiz_data_from_spreadsheet_data(data);
                        var results_data = self.make_results_data_from_spreadsheet_data(data, quiz_data);
                        self.init_data(quiz_data, results_data);
                    }
                });
            },
            calculate_aspectratios: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    for (var k = 0; k < row.possible_answers.length; k++) {
                        var answer = row.possible_answers[k];
                        self.find_aspectratio_for_each_type_of_video_embed(answer);
                    }

                    self.find_aspectratio_for_each_type_of_video_embed(row.question);
                }
            },

            find_aspectratio_for_each_type_of_video_embed : function(slide) {
                for (var i = 0; i < self.possible_display_elements.length; i++ ) {
                    var display = self.possible_display_elements[i];
                    if ( display.needs_aspect_ratio && slide[display.name] ) {
                        slide[display.name + 'aspectratio'] =
                            self.find_aspectratio(slide[display.name]);
                    }
                }
            },
            find_aspectratio: function(videoembed) {
                var height = videoembed.match(/height="\d+"/);
                if (!height || !height[0]) {
                    console.log('Your video embed code needs a height.');
                    return '';
                }
                height = parseInt(height[0].replace(/height="/, '').replace(/"/, ''), 10);
                                
                var width = videoembed.match(/width="\d+"/);
                if (!width || !width[0]) {
                    console.log('Your video embed code needs a width.');
                    return '';
                }
                width = parseInt(width[0].replace(/width="/, '').replace(/"/, ''), 10);
            
                return (height / width)*100;
            },
            pull_answer_value_from_spreadsheet : function(row, value, wrong_number, correct) {
                correct = correct ? 'right' : 'wrong';
                if (row[correct + wrong_number + value] && row[correct + wrong_number + value] !== self.defaulting_flag) {
                    return (row[correct + wrong_number + value]);                    
                }
                
                if ((self.defaulting_behavior_on && row[correct + wrong_number + value] !== self.defaulting_flag) ||
                    (!self.defaulting_behavior_on && row[correct + wrong_number + value] === self.defaulting_flag) 
                ) {
                    return (row[correct + value] && row[correct + value] !== self.defaulting_flag ?
                                   row[correct + value] :
                                   (row['answer' + value] && row['answer' + value] !== self.defaulting_flag ?
                                        row['answer' + value] :
                                        row['question' + value]
                                  )
                            );
                } else {
                    return '';
                }
            },
            get_possible_answers : function(row, is_correct) {
                var possible_answers = [];
                var right_or_wrong = (is_correct ? 'right' : 'wrong');
                if (row[right_or_wrong]) {
                    possible_answers.push(self.make_possible_answer(row, '', is_correct));
                }
                for (var i = 0; i < 10; i++ ) {
                    if (row[right_or_wrong + i]) {
                        possible_answers.push(self.make_possible_answer(row, i, is_correct));
                    }
                }
                return possible_answers;
            },
            make_possible_answer: function(row, row_number, is_correct) {
                var right_or_wrong = (is_correct ? 'right' : 'wrong');
                var answer = {
                    answer: row[right_or_wrong + row_number],
                    correct: is_correct
                };
                for (var i = 0; i < self.possible_display_elements.length; i++ ) {
                    var display_element = self.possible_display_elements[i].name;
                    answer[display_element] = self.pull_answer_value_from_spreadsheet(
                        row, display_element, row_number, is_correct
                    );
                }
                return answer;
            },
            make_quiz_data_from_spreadsheet_data: function(tabletop) {
                var i, j, sheetName, data;
                var quiz = [];

                // Find a sheet that _isn't_ named "Results".
                for (sheetName in tabletop) {
                    if (tabletop.hasOwnProperty(sheetName) && sheetName !== 'Results') {
                        break;
                    }
                }

                data = tabletop[sheetName].elements;

                for (i = 0; i < data.length; i++) {
                    var row = data[i];
                    var possible_wrong_answers = self.get_possible_answers(row, false);
                    var possible_right_answers = self.get_possible_answers(row, true);

                    var right_answer_placement = [];
                    for (j = 0; j < possible_right_answers.length; j++) {
                        right_answer_placement.push(
                            Math.round(Math.random() * possible_wrong_answers.length)
                        );
                    }
                    // IMPORTANT TO SORT THIS. rather than check if a value is in, we only check the first
                    right_answer_placement.sort();

                    var possible_answers= [];
                    var right_answers_placed = 0;
                    for (j = 0; j <= possible_wrong_answers.length; j++) {
                        while (j === right_answer_placement[right_answers_placed]) {
                            //push right answer
                            possible_answers.push(possible_right_answers[right_answers_placed]);
                            right_answers_placed++;
                        }
                        if (j === possible_wrong_answers.length) {
                            continue;
                        }
                        possible_answers.push(possible_wrong_answers[j]);
                    }

                    var question = {
                        question : {
                        },
                        possible_answers : possible_answers,
                        rowNumber : row.rowNumber - 1
                    };
                    for (j = 0; j < self.possible_display_elements.length; j++) {
                        var display_value = self.possible_display_elements[j].name;
                        question.question[display_value] = row['question' + display_value];
                    }
                    quiz.push(question);
                }
                return quiz;
            },
            make_results_data_from_spreadsheet_data: function(tabletop, quiz_data) {
                var ret = make_default_how_you_did_htmls(quiz_data.length);

                var data = tabletop['Results'] ? tabletop['Results'].elements : [];
                for (var i = 0; i < data.length; i++) {
                    var index = data[i].numberofrightanswers;
                    if (index) { index = parseInt(index, 10); }
                    if (!isNaN(index)) {
                        if (!ret[index]) {
                            console.log("Invalid number of correct answers: " + index);
                        } else {
                            ret[index] = data[i].html;
                        }
                    }
                }

                return ret;
            },
            append_question : function(question_index) {
                var question_data = self.quiz_data[question_index];
                var question_container = $('<li class="question_container row-fluid question_' +
                        question_index +
                        '"></li>'
                );
                question_container.append( self.build_question_element_from_row(question_data) );
                question_container.append( self.build_possible_answer_elements_from_row(question_data, question_index) );
                container_elem.append(question_container);
            },
            build_question_element_from_row: function(row) {
                var question_container = $('<div class="question col-12 show" style="overflow: hidden; position: relative;"></div>');
                for (var i = 0; i < self.possible_display_elements.length; i++) {
                    question_container.append(
                        self.possible_display_elements[i].create_element(row.question)
                    );
                }
                return question_container;
            },
            build_possible_answer_elements_from_row : function(question, question_index) {
                var answers_container = $('<ul class="col-12 possible_answers possible_answers_' +
                    question_index + '"></ul>');

                function bindClick(question_index, answer_index, possible_answer) {
                    possible_answer.bind('click', function() {
                        // was it the right answer?
                        var was_correct = self.quiz_data[question_index].possible_answers[answer_index].correct;

                        // Add correct classes to possible answers
                        answers_container.find('.selected').removeClass('selected');
                        $(this).addClass('selected');
                        $(this).removeClass('possible_answer');
                        answers_container
                            .find('.answer_' + answer_index)
                            .addClass( 
                                was_correct ? 'correct_answer' : 'wrong_answer'
                            );

                        //track how many you got right the first time
                        cheater_answer_tracking[question_index] = was_correct;
                        if ( typeof(answer_tracking[question_index]) === 'undefined' ) {
                            answer_tracking[question_index] = was_correct;
                            cover.find('.question_' + question_index).addClass(
                                'first_guess_' +
                                (was_correct ? 'right' : 'wrong')
                            );
                        }
                        self.update_how_you_did_element();

                        //show new slide
                        self.display_answer(self.quiz_data[question_index], question_index, self.quiz_data[question_index].possible_answers[answer_index]);
                        
                        // track that this was selected last
                        self.quiz_data[question_index].previously_selected = self.quiz_data[question_index].possible_answers[answer_index];
                    });
                }

                for (var i = 0; i < question.possible_answers.length; i++) {
                    var answer_data = question.possible_answers[i];
                    var possible_answer = $('<li class="possible_answer col-12 answer_' +
                        i +
                        '">' +
                        answer_data.answer +
                        '</li>');
                    bindClick(question_index, i, possible_answer);
                    answers_container.append(possible_answer);
                }
                return answers_container;
            },
            add_display_in_correct_place: function(container, place_in_display_elements, slide) {
                for ( var i = place_in_display_elements; i > 0; i-- ) {
                    if (self.possible_display_elements[i - 1].finder(container).length ) {
                        self.possible_display_elements[i - 1].finder(container)
                            .after( self.possible_display_elements[place_in_display_elements].create_element(slide) );
                        return;
                    }
                }
                container.prepend( 
                    self.possible_display_elements[place_in_display_elements].create_element(slide)
                );
            },
            display_answer : function(question, question_index, answer) {
                var displayed_slide = question.previously_selected ?
                    question.previously_selected :
                    question.question;
                var slide = container_elem.find('.question_' + question_index + ' .question');
                slide.addClass('revealed_answer');
                for (var i = 0; i < self.possible_display_elements.length; i++) {
                    var display_value = self.possible_display_elements[i].name;
                    if ( answer[display_value] !== displayed_slide[display_value] ) {
                        if ( !answer[display_value] ) {
                            self.possible_display_elements[i].finder(slide).remove();
                        } else if ( !displayed_slide[display_value] ) {
                            self.add_display_in_correct_place(slide, i, answer);
                        } else {
                            self.possible_display_elements[i].finder(slide).before(
                                self.possible_display_elements[i].create_element( answer )
                            ).remove();
                        }
                    }
                }
            },

            create_cover : function() {
                cover = $('#' + self.container);
                container_elem = $('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('quiz_container');
                container_elem.css('padding', '0px');
            },
            update_how_you_did_element: function() {
                var right_answers = 0;
                var user_answers = self.cheating ? cheater_answer_tracking : answer_tracking;
                var unfinished = false;
                for (var i = 0; i < self.quiz_data.length; i++) {
                    if (typeof(answer_tracking[i]) === 'undefined') {
                        unfinished = true;
                    }
                    if (user_answers[i]) {
                        right_answers++;
                    }
                }
                var html;
                if (unfinished && typeof(this.not_finished_html) !== 'undefined') {
                    html = this.not_finished_html;
                } else {
                    html = this.results_data[right_answers];
                }
                how_you_did_element.html(html);
            }
        };
        return quiz.init(quiz_data, results_data, options);
    };

    $.fn.quiz = function(quiz_data, results_data, options) {
        if (!options) { options = results_data; results_data = null; }
        if (!options) { options = {}; }
        options.container = this.attr('id');
        this.quiz = $.quiz(quiz_data, results_data, options);
        return this;
    };
})(jQuery);
