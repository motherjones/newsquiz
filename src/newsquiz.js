/*
 * GDoc-Powered-Quiz
 * https://github.com/motherjones/GDoc-Powered-Quiz
 *
 * Copyright (c) 2012 Ben Breedlove
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

    $.quiz = function(quiz_data, options) {
        var container_elem;
        var self;
        var answer_tracking = [];
        var correct_answers_element;

        var quiz = {
			defaulting_behavior_on : false,
            defaulting_flag : '!default',
			container : 'quiz_container',
            init : function(quiz_data, options) {

                self = this;
                if (options) {
                    for ( var option in options ) {
                        self[option] = options[option];
                    }
                }

				

                if (typeof(quiz_data) === 'string') {
                    //is a google spreadsheet
                    self.make_quiz_from_google_spreadsheet(quiz_data);
                    return self;
                }

                self.calculate_aspectratios(quiz_data);

                self.quiz_data = quiz_data;
                    
                self.create_cover();

                for ( var i = 0; i < self.quiz_data.length; i++ ) {
                    self.append_question(i);
                }

                self.append_how_you_did_section();

                return self;
            },
            append_how_you_did_section: function() {
                correct_answers_element = jQuery('<span class="correct_answers">0</span>');
                var how_you_did_element = jQuery('<p class="how_you_did"></p>');
                how_you_did_element.append(jQuery('<span>You got </span>'));
                how_you_did_element.append(correct_answers_element);
                how_you_did_element.append(jQuery('<span> correct answers out of ' + self.quiz_data.length + ' questions</span>'));
                cover.append(how_you_did_element);
                cover.append(jQuery('<p class="small">on your first attempt. No fair changing your answers after you found out you were wrong</p>'));
            },

            make_quiz_from_google_spreadsheet: function(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback: function(data) {
                        var quiz_data = self.make_quiz_data_from_spreadsheet_data(data);
                        self.init(quiz_data, options);
                    },
                    simpleSheet: true
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
				var types_of_video_embeds = ['top', 'middle', 'bottom'];
                for (var i = 0; i < types_of_video_embeds.length; i++) {
                    if ( slide[types_of_video_embeds[i] + 'videoembed'] ) {
                        slide[types_of_video_embeds[i] + 'aspectratio'] 
                            = self.find_aspectratio(slide[types_of_video_embeds[i] + 'videoembed']);
                    }
                }
            },

            pull_answer_value_from_spreadsheet : function(row, value, wrong_number, correct) {
                var correct = correct ? 'right' : 'wrong';
				if (row[correct + wrong_number + value] && row[correct + wrong_number + value] !== self.defaulting_flag) {
					return (row[correct + wrong_number + value]);					
				}
				
				if (   (self.defaulting_behavior_on && row[correct + wrong_number + value] !== self.defaulting_flag) 				
                	|| (!self.defaulting_behavior_on && row[correct + wrong_number + value] === self.defaulting_flag) 
				) {
					return (row[correct + value] && row[correct + value] !== self.defaulting_flag
                               	? row[correct + value]
                               	: (row['answer' + value] && row['answer' + value] !== self.defaulting_flag
                                    	? row['answer' + value]
                                    	: row['question' + value]
                                  )
                    		);
				} else {
					return '';
				}
            },
            find_aspectratio: function(videoembed) {
				var height = videoembed.match(/height="\d+"/);
				if (!height[0]) {
					console.log('Your video embed code needs a height.');
					return;
				};
				height = parseInt(height[0].replace(/height="/, '').replace(/"/, ''));
								
				var width = videoembed.match(/width="\d+"/);
				if (!width[0]) {
					console.log('Your video embed code needs a width.');
					return;
				};
				width = parseInt(width[0].replace(/width="/, '').replace(/"/, ''));
			
				return (height / width)*100;
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
            make_possible_answer: function(row, i, is_correct) {
                var right_or_wrong = (is_correct ? 'right' : 'wrong');
                return {
                    answer: row[right_or_wrong + i],
                    correct: is_correct,
                    title: self.pull_answer_value_from_spreadsheet(row, 'title', i, is_correct),
                    subhed: self.pull_answer_value_from_spreadsheet(row, 'subhed', i, is_correct),
                    text : self.pull_answer_value_from_spreadsheet(row, 'text', i, is_correct),
                    topimage: self.pull_answer_value_from_spreadsheet(row, 'topimage', i, is_correct),
					topvideoembed: self.pull_answer_value_from_spreadsheet(row, 'topvideoembed', i, is_correct),
					middleimage: self.pull_answer_value_from_spreadsheet(row, 'middleimage', i, is_correct),
					//youtube: self.pull_youtube_id(self.pull_answer_value_from_spreadsheet(row, 'youtube', i, is_correct)),
					middlevideoembed: self.pull_answer_value_from_spreadsheet(row, 'middlevideoembed', i, is_correct),
                    bottomimage: self.pull_answer_value_from_spreadsheet(row, 'bottomimage', i, is_correct),
					bottomvideoembed: self.pull_answer_value_from_spreadsheet(row, 'bottomvideoembed', i, is_correct),
                    backgroundimage: self.pull_answer_value_from_spreadsheet(row, 'backgroundimage', i, is_correct)
                };
            },
            make_quiz_data_from_spreadsheet_data: function(data) {
                var quiz = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var possible_wrong_answers = self.get_possible_answers(row, false);
                    var possible_right_answers = self.get_possible_answers(row, true);

                    var right_answer_placement = [];
                    for (var j = 0; j < possible_right_answers.length; j++) {
                        right_answer_placement.push(
                            Math.round(Math.random() * possible_wrong_answers.length)
                        );
                    }
                    // IMPORTANT TO SORT THIS. rather than check if a value is in, we only check the first
                    right_answer_placement.sort();

                    var possible_answers= [];
                    var right_answers_placed = 0;
                    for (var j = 0; j <= possible_wrong_answers.length; j++) {
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
                                       title: row.questiontitle,
                                       subhed: row.questionsubhed,
                                       text : row.questiontext,
                                       topimage: row.questiontopimage,
                                       topvideoembed: row.questiontopvideoembed,
									   middleimage: row.questionmiddleimage,
                                       middlevideoembed: row.questionmiddlevideoembed,
                                       bottomimage: row.questionbottomimage,
                                       bottomvideoembed: row.questionbottomvideoembed,
                                       backgroundimage: row.questionbackgroundimage
                        },
                        possible_answers : possible_answers,
                        rowNumber : row.rowNumber - 1
                    };
                    //do stuff to turn data into quiz acceptable json
                    quiz.push(question);
                }
                return quiz;
            },
            append_question : function(question_index) {
                var question_data = self.quiz_data[question_index]
                var question_container = jQuery('<li class="question_container row-fluid question_'
                        + question_index
                        + '"></li>'
                );
                question_container.append( self.build_question_element_from_row(question_data) );
                //question_container.append( self.build_revealed_answer_element_from_row(question_data) );
                question_container.append( self.build_possible_answer_elements_from_row(question_data, question_index) );
                container_elem.append(question_container);
            },
            build_question_element_from_row: function(row) {
                return jQuery('<div class="question span12 show" style="overflow: hidden; position: relative;"> '
                        + self.create_slide_guts(row.question)
                    + '</div>');
            },
            create_slide_guts : function(slide) {
                var guts = '';
                for (var i = 0; i < self.possible_display_values.length; i++) {
                    var display_value = self.possible_display_values[i];
                    guts += self.create_display_element(display_value, slide)
                }
                return guts;
            },
            build_possible_answer_elements_from_row : function(question, question_index) {
                var answers_container = jQuery('<ul class="span12 possible_answers possible_answers_'
                    + question_index + '"></ul>');
                for (var i = 0; i < question.possible_answers.length; i++) {
                    var answer_data = question.possible_answers[i];
                    var possible_answer = jQuery('<li class="possible_answer span12 answer_' 
                        + i
                        + '">'
                        + answer_data.answer
                        + '</li>');
                    (function(question_index, answer_index, possible_answer) {
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
                                    was_correct
                                        ? 'correct_answer'
                                        : 'wrong_answer'
                                );

                            //track how many you got right the first time
                            if ( typeof(answer_tracking[question_index]) === 'undefined' ) {
                                answer_tracking[question_index] = was_correct;
                                self.update_correct_answers_element();
                                cover.find('.question_' + question_index).addClass(
                                    'first_guess_'
                                    + ( was_correct
                                        ? 'right'
                                        : 'wrong'
                                      )
                                );
                            }

                            //show new slide
                            self.display_answer(self.quiz_data[question_index], question_index, self.quiz_data[question_index].possible_answers[answer_index]);
                            
                            // track that this was selected last
                            self.quiz_data[question_index].previously_selected = self.quiz_data[question_index].possible_answers[answer_index];
                        });
                    })(question_index, i, possible_answer);
                    answers_container.append(possible_answer);
                }
                return answers_container;
            },

            possible_display_values  : [
                'backgroundimage',
                'topimage',
                'topvideoembed',
                'title',
                'middleimage',
                'middlevideoembed',
                'subhed',
                'text',
                'bottomimage',
                'bottomvideoembed'
            ],
            add_display_in_correct_place: function(container, place_in_display_values, slide) {
                for ( var i = place_in_display_values; i > 0; i-- ) {
                    if (container.find('.' + self.possible_display_values[i - 1]) ) {
                        container.find('.' + self.possible_display_values[i - 1])
                            .after( self.create_display_element(
                                        self.possible_display_values[place_in_display_values],
                                        slide
                                    ) 
                            );
                        return;
                    }
                }
                container.prepend( 
                    self.create_display_element(
                        self.possible_display_values[place_in_display_values], 
                        slide
                    ) 
                );
            },
            create_display_element: function( type, slide ) {
                switch (type) {
                    case 'backgroundimage':
                        //FIXME OH crap this isn't an element why do I hate myself
                        return ( slide[type] 
                                ? '<div class="' + type + '" style="background-image: url(\'' 
                                    + slide[type] + '\'); height: 100%; width: 100%;position:absolute;z-index: -1"></div>'
                                : '');
                        break;
                    case 'topimage':
                       return ( slide[type] 
                            ? '<img src="' + slide[type] + '" class="' + type + '"></img>' 
                            : ''  );
                        break;
                    case 'topvideoembed':
                        return ( slide.topaspectratio 
                            ? '<div class="videoembed ' + type + '" style="padding-bottom:' + slide.topaspectratio + '%">' + slide[type] + '</div>'
                            : ''  );
                    break;
                    case 'title':
                        return ( slide[type] 
                                ? '<h1 class="' + type + '">' + slide[type] + '</h1>' 
                                : ''  );
                        break;
                    case 'middleimage':
                        return ( slide[type] 
                                ? '<img src="' + slide[type] + '" class="' + type + '"></img>' 
                                : ''  );                   
                        break;
                    case 'middlevideoembed':
                        return ( slide.middleaspectratio 
                                ? '<div class="videoembed ' + type + '" style="padding-bottom:' + slide.middleaspectratio + '%">' + slide[type] + '</div>'
                                : ''  );
                        break;
                    case 'subhed':
                        return ( slide[type] 
                                ? '<h2 class="' + type +'">' + slide[type] + '</h2>' 
                                : ''  );
                        break;
                    case 'text':
                        return '<p class="' + type + '">' + slide[type] + '</p>'
                        break;
                    case 'bottomimage':
                        return ( slide[type] 
                                ? '<img src="' + slide[type] + '" class="' + type + '"></img>' 
                                : ''  );
                        break;
                    case 'bottomvideoembed':
                        return ( slide.bottomaspectratio 
                                ? '<div class="videoembed" style="padding-bottom:' + slide.bottomaspectratio + '%">' + slide[type] + '</div>'
                                : ''  );
                        break;
                }
            },
            display_answer : function(question, question_index, answer) {
                var displayed_slide = question.previously_selected
                    ? question.previously_selected
                    : question.question;
                var slide = container_elem.find('.question_' + question_index + ' .question');
                slide.addClass('revealed_answer');
                for (var i = 0; i < self.possible_display_values.length; i++) {
                    var display_value = self.possible_display_values[i];
                    // If things don't change when they should, consider !== here first
                    if ( answer[display_value] != displayed_slide[display_value] ) {
                        if ( !answer[display_value] ) {
                            // FIXME abstract the classes we add
                            slide.find('.' + display_value).remove();
                            //remove thing
                        } else if ( !displayed_slide[display_value] ) {
                            //place in display values is i, here
                            self.add_display_in_correct_place(slide, i, answer);
                        } else {
                            //replace thign
                            slide.find('.' + display_value).before(jQuery(
                                        self.create_display_element( display_value, answer )
                                )).remove();
                        }
                    }
                }
            },

            create_cover : function() {
                cover = $('#' + self.container);
                container_elem = jQuery('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('quiz_container');
                container_elem.css('padding', '0px');
            },
            update_correct_answers_element: function() {
                var right_answers = 0;
                for (var i = 0; i < self.quiz_data.length; i++) {
                    if (answer_tracking[i]) {
                        right_answers++;
                    }
                }
                correct_answers_element.text(right_answers);
            }
        };
        return quiz.init(quiz_data, options);
    };

    $.fn.quiz = function(quiz_data, options) {
        options = options || {};
        options.container = this.attr('id');
        this.quiz = $.quiz(quiz_data, options);
        return this;
    };
}(jQuery));
