"use strict";

// QUnit unit test for questionnaire creator 'core' functionality

var RUN_QUESTIONNAIRE_CORE_TESTS = false;

function init_test_setting() {
	var div1 = document.createElement('div');
	var div2 = document.createElement('div');
	var seed = new Date().getTime().toString();

	$(div1).attr('id', 'qunit');
	$(div2).attr('id', 'qunit-fixture').append($('body').html());

	$('body').html('').append(div1).append(div2);

	QUnit.config.requireExpects = true;
	QUnit.config.reorder = false;
	QUnit.config.seed = seed;
}

if (RUN_QUESTIONNAIRE_CORE_TESTS == true) {
	$(document).ready(function() {
		init_test_setting();

		QUnit.module('Questionnaire core tests');

		QUnit.test('Add question', function(assert) {
			assert.expect(5);

			assert.strictEqual(questionnaire_get_questions().length, 0);

			var question = questionnaire_add_question();
			var question_type_div = questionnaire_get_question_type_div(question);

			assert.ok(question);
			assert.ok(question_type_div);
			assert.strictEqual(questionnaire_get_questions().length, 1);
			assert.strictEqual($(question_type_div).html(), questionnaire_get_question_type_prototype(questionnaire.question_type.default_type).html());
		});

		QUnit.test('Add heading and description', function(assert) {
			assert.expect(4);

			assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 0);

			var heading_and_description = questionnaire_add_heading_and_description();

			assert.ok(heading_and_description);
			assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 1);
			assert.strictEqual($(heading_and_description).html(), questionnaire_get_heading_and_description_prototype().html());
		});

		QUnit.test('Add image', function(assert) {
			assert.expect(1);
			assert.equal(1,1);
		});

		QUnit.test('Preview questionnaire', function(assert) {
			assert.expect(8);

			var preview_mode_assertions = function(preview_mode_enabled) {
				var contenteditable_attr_preview_value = (preview_mode_enabled ? 'false' : 'true');

				assert.strictEqual($(questionnaire.title.selector).attr('contenteditable'), contenteditable_attr_preview_value);
				assert.strictEqual($(questionnaire.description.selector).attr('contenteditable'), contenteditable_attr_preview_value);
			};

			preview_mode_assertions(false);

			assert.strictEqual(questionnaire_preview_questionnaire(true), true);

			preview_mode_assertions(true);

			assert.strictEqual(questionnaire_preview_questionnaire(false), true);

			preview_mode_assertions(false);
		});

		QUnit.module('Create links', {
			beforeEach: function() {
				var range = document.createRange();
				range.selectNode($('.questionnaire-title').get(0));
				var selection = document.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);

				this.range = range;
				this.selection = selection;
			}
		});

		QUnit.test('Create hyperlink from selection', function(assert) {
			assert.expect(5);

			var new_hyperlink = questionnaire_create_hyperlink_from_selection(this.selection, this.range, 'http://www.example.com');

			assert.ok(new_hyperlink);
			assert.strictEqual($(new_hyperlink).attr('href'), 'http://www.example.com');
			assert.strictEqual($(new_hyperlink).attr('target'), '_blank');
			assert.strictEqual($(new_hyperlink).text(), questionnaire.title.default_text);

			// The selection should be surrounded by an new anchor element:
			assert.strictEqual($(questionnaire.title.selector).parent().get(0).tagName.toLowerCase(), 'a');
		});

		QUnit.test('Create email-link from selection', function(assert) {
			assert.expect(5);

			var recipient = 'joe@example.com';
			var new_email_link = questionnaire_create_email_link_from_selection(this.selection, this.range, recipient);

			assert.ok(new_email_link);
			assert.strictEqual($(new_email_link).attr('href'), 'mailto:' + recipient);
			assert.strictEqual($(new_email_link).attr('target'), '_blank');
			assert.strictEqual($(new_email_link).text(), questionnaire.title.default_text);

			// The selection should be surrounded by an new anchor element:
			assert.strictEqual($(questionnaire.title.selector).parent().get(0).tagName.toLowerCase(), 'a');
		});

		QUnit.module('Clear questionnaire', {
			beforeEach: function(assert) {
				assert.strictEqual(questionnaire_get_questions().length, 0);
				assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 0);
				assert.strictEqual(questionnaire_get_sections().length, 0);

				assert.ok(questionnaire_add_heading_and_description());
				assert.ok(questionnaire_add_question());

				assert.strictEqual(questionnaire_get_questions().length, 1);
				assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 1);
				assert.strictEqual(questionnaire_get_sections().length, 2);
			},
			afterEach: function(assert) {
				var done = assert.async();

				setTimeout(function() {
					assert.strictEqual(questionnaire_get_questions().length, 0);
					assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 0);
					assert.strictEqual(questionnaire_get_sections().length, 0);
					done();
				}, 1100);
			}
		});

		QUnit.test('Via "Clear questionnaire" toolbar button', function(assert) {
			assert.expect(8 + 3 + 3);

			assert.ok(questionnaire_clear());
			assert.strictEqual(questionnaire_get_title(), questionnaire.title.default_text);
			assert.strictEqual(questionnaire_get_description(), questionnaire.description.default_text);
		});

		QUnit.test('Via "Remove section" button', function(assert) {
			assert.expect(8 + 2 + 3);

			questionnaire_get_sections().each(function(index, section) {
				assert.ok(questionnaire_remove_section($(section)));
			});
		});

		QUnit.module('Question operations');

		QUnit.test('Move question up', function(assert) {
			assert.expect(1);
			assert.equal(1,1);
		});

		QUnit.test('Move question down', function(assert) {
			assert.expect(1);
			assert.equal(1,1);
		});

		QUnit.test('Remove question', function(assert) {
			assert.expect(5);

			assert.strictEqual(questionnaire_get_questions().length, 0);

			var question = questionnaire_add_question();

			assert.ok(question);
			assert.strictEqual(questionnaire_get_questions().length, 1);
			assert.strictEqual(questionnaire_remove_section(question), true);

			var done = assert.async();

			setTimeout(function() {
				assert.strictEqual(questionnaire_get_questions().length, 0);
				done();
			}, 1100);
		});

		QUnit.module('Question types');

		QUnit.test('Are question types single choice: radio buttons and multiple choice: checkboxes', function(assert) {
			var single_choice_radio_buttons_question = questionnaire_add_question(questionnaire.question_types.single_choice_radio_buttons.name);
			var multiple_choice_checkboxes_question = questionnaire_add_question(questionnaire.question_types.multiple_choice_checkboxes.name);

			assert.expect(4);

			assert.ok(single_choice_radio_buttons_question);
			assert.ok(multiple_choice_checkboxes_question);

			assert.strictEqual(questionnaire_are_questions_of_type_single_choice_radio_buttons_and_multiple_choice_checkboxes(single_choice_radio_buttons_question, multiple_choice_checkboxes_question), true);
			assert.strictEqual(questionnaire_are_questions_of_type_single_choice_radio_buttons_and_multiple_choice_checkboxes(multiple_choice_checkboxes_question, single_choice_radio_buttons_question), true);
		});

		QUnit.test('Valid question types', function(assert) {
			assert.expect(Object.keys(questionnaire.question_types).length);

			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.short_answer.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.paragraph.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.single_choice_list.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.single_choice_radio_buttons.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.multiple_choice_list.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.multiple_choice_checkboxes.name), true);
			assert.strictEqual(questionnaire_is_question_type_valid(questionnaire.question_types.ranked_choice.name), true);
		});

		QUnit.test('Invalid question types', function(assert) {
			assert.expect(7);

			assert.strictEqual(questionnaire_is_question_type_valid(), false);
			assert.strictEqual(questionnaire_is_question_type_valid('incorrect-question-type'), false);
			assert.strictEqual(questionnaire_is_question_type_valid(''), false);
			assert.strictEqual(questionnaire_is_question_type_valid(null), false);
			assert.strictEqual(questionnaire_is_question_type_valid(32), false);
			assert.strictEqual(questionnaire_is_question_type_valid(32.433), false);
			assert.strictEqual(questionnaire_is_question_type_valid(function() {}), false);
		});

		QUnit.test('Change to same question type', function(assert) {
			assert.expect(2*Object.keys(questionnaire.question_types).length);

			for (var question_type in questionnaire.question_types) {
				var question = questionnaire_add_question(questionnaire.question_types[question_type].name);

				assert.ok(question);

				// A change to the same question type should return 'false' and not change question markup
				assert.strictEqual(questionnaire_change_question_type(question, questionnaire.question_types[question_type].name), false);
			}
		});

		/*
		QUnit.test('Change to other valid question type', function(assert) {
			for (var question_type in questionnaire.question_types) {
				var question = questionnaire_add_question(questionnaire.question_types[question_type]);
			}
		});
		*/

		QUnit.test('Change to incorrect question type', function(assert) {
			assert.expect(7);

			var question = questionnaire_add_question();

			assert.ok(question);
			assert.strictEqual(questionnaire_get_question_type(question), questionnaire.question_type.default_type);
			assert.strictEqual(questionnaire_change_question_type(question, 'incorrect-question-type'), false);
			assert.strictEqual(questionnaire_get_question_type(question), questionnaire.question_type.default_type);
			assert.strictEqual(questionnaire_change_question_type(question), false);
			assert.strictEqual(questionnaire_get_question_type(question),  questionnaire.question_type.default_type);
			assert.strictEqual(questionnaire_change_question_type(question, 342), false);
		});

		QUnit.module('Heading and description operations');

		QUnit.test('Remove heading and description', function(assert) {
			assert.expect(5);

			assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 0);

			var heading_and_description = questionnaire_add_heading_and_description();

			assert.ok(heading_and_description);
			assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 1);
			assert.strictEqual(questionnaire_remove_section(heading_and_description), true);

			var done = assert.async();

			setTimeout(function() {
				assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 0);
				done();
			}, 1100);
		});

		QUnit.test('Only one section movement', function(assert) {
			assert.expect(5);

			var section = questionnaire_add_heading_and_description();
			var section_array = questionnaire_get_sections_array(questionnaire.default_section_sort_function);

			assert.ok(section);
			assert.ok(section_array);
			assert.strictEqual(questionnaire_move_section(section, -1), false);
			assert.strictEqual(questionnaire_move_section(section, 1), false);
			assert.deepEqual(section_array, questionnaire_get_sections_array(questionnaire.default_section_sort_function));
		});

		QUnit.module('Section duplication');

		QUnit.test('Duplicate heading and description without movement', function(assert) {
			assert.expect(4);

			var heading_and_description = questionnaire_add_heading_and_description();
			var heading_and_description_top = heading_and_description.position().top;
			var cloned_heading_and_description = questionnaire_duplicate_section(heading_and_description);

			assert.ok(cloned_heading_and_description);
			assert.strictEqual(questionnaire_get_heading_and_descriptions().length, 2);
			assert.strictEqual(heading_and_description.position().top, heading_and_description_top);

			var done = assert.async();

			setTimeout(function() {
				assert.strictEqual(Math.round(cloned_heading_and_description.position().top),
									Math.round(heading_and_description_top + heading_and_description.outerHeight(true)));
				done();
			}, 1100);
		});

		QUnit.test('Duplicate question without movement', function(assert) {
			assert.expect(4);

			var question = questionnaire_add_question();
			var question_top = question.position().top;
			var cloned_question = questionnaire_duplicate_section(question);

			assert.ok(cloned_question);
			assert.strictEqual(questionnaire_get_questions().length, 2);
			assert.strictEqual(question.position().top, question_top);

			var done = assert.async();

			setTimeout(function() {
				assert.strictEqual(Math.round(cloned_question.position().top), Math.round(question_top + question.outerHeight(true)));
				done();
			}, 1100);
		});

		QUnit.test('Duplicate section with movement', function(assert) {
			assert.expect(1);
			assert.ok(true);
		});

		QUnit.test('Duplicate undefined section', function(assert) {
			assert.expect(2);

			assert.strictEqual(questionnaire_duplicate_section(), false);
			assert.strictEqual(questionnaire_duplicate_section(undefined), false);
		});

		QUnit.test('Duplicate null section', function(assert) {
			assert.expect(1);

			assert.strictEqual(questionnaire_duplicate_section(null), false);
		});

		QUnit.module('Successful section movement', {
			beforeEach: function(assert) {
				assert.ok(questionnaire_add_heading_and_description());
				assert.ok(questionnaire_add_question());

				this.sections_array = questionnaire_get_sections_array(questionnaire.default_section_sort_function);

				assert.ok(this.sections_array);
				assert.strictEqual(questionnaire_get_section_z_index(this.sections_array[0]), 1);
				assert.strictEqual(questionnaire_get_section_z_index(this.sections_array[1]), 2);
			},
			afterEach: function(assert) {
				this.updated_sections_array = questionnaire_get_sections_array(questionnaire.default_section_sort_function);

				assert.ok(this.updated_sections_array);
				assert.deepEqual(this.updated_sections_array[0], this.sections_array[1]);
				assert.deepEqual(this.updated_sections_array[1], this.sections_array[0]);
				assert.strictEqual(questionnaire_get_section_z_index(this.sections_array[0]), 2);
				assert.strictEqual(questionnaire_get_section_z_index(this.sections_array[1]), 1);
				assert.strictEqual(questionnaire_get_section_z_index(this.updated_sections_array[0]), 1);
				assert.strictEqual(questionnaire_get_section_z_index(this.updated_sections_array[1]), 2);
			}
		});

		QUnit.test('Move first section down', function(assert) {
			assert.expect(12 + 1);
			assert.strictEqual(questionnaire_move_section($(this.sections_array[0]), 1), true);
		});

		QUnit.test('Move last section up', function(assert) {
			assert.expect(12 + 1);
			assert.strictEqual(questionnaire_move_section($(this.sections_array[this.sections_array.length-1]), -1), true);
		});

		QUnit.module('Unsuccessful section movement', {
			beforeEach: function(assert) {
				assert.ok(questionnaire_add_heading_and_description());
				assert.ok(questionnaire_add_question());

				this.sections_array = questionnaire_get_sections_array(questionnaire.default_section_sort_function);

				assert.ok(this.sections_array);
			},
			afterEach: function(assert) {
				this.updated_sections_array = questionnaire_get_sections_array(questionnaire.default_section_sort_function);

				assert.ok(this.updated_sections_array);
				assert.deepEqual(this.updated_sections_array[0], this.sections_array[0]);
				assert.deepEqual(this.updated_sections_array[1], this.sections_array[1]);
			}
		});

		QUnit.test('Move first section up', function(assert) {
			assert.expect(6 + 1);
			assert.strictEqual(questionnaire_move_section(this.sections_array[0], -1), false);
		});

		QUnit.test('Move last section down', function(assert) {
			assert.expect(6 + 1);
			assert.strictEqual(questionnaire_move_section(this.sections_array[this.sections_array.length-1]), false);
		});

		/*
		QUnit.module('Single choice: radio buttons & multiple choice: checkboxes movement');

		QUnit.test('Swap place: single choice: radio buttons & single choice: radio buttons', function(assert) {
			var number_of_questions = 2;
			var number_of_alternatives_per_question = 3;
			var questions_array = new Array(number_of_questions);
			var alternatives_array = new Array(number_of_questions);

			assert.expect(3*(number_of_questions*number_of_alternatives_per_question) + 1);

			for (var a = 0; a < number_of_questions; a++) {
				questions_array[a] = questionnaire_add_question(questionnaire.question_types.single_choice_radio_buttons.name);
				alternatives_array[a] = new Array(number_of_alternatives_per_question);

				for (var b = 0; b < number_of_alternatives_per_question; b++) {
					alternatives_array[a][b] = questionnaire_add_question_answer_alternative(questions_array[a], questionnaire.question_types.single_choice_radio_buttons.name);
					assert.ok(alternatives_array[a][b]);

					console.log(a + ':' + b);
				}
			}

			$(questionnaire_get_question_answer_alternatives_list(questions_array[0])).each(function(index, alternative) {
				assert.strictEqual(
					$(alternative).children('input').attr('id'),
					questionnaire_produce_single_multiple_choice_alternative_name(1, index+1)
				);
			});

			$(questionnaire_get_question_answer_alternatives_list(questions_array[1])).each(function(index, alternative) {
				assert.strictEqual(
					$(alternative).children('input').attr('id'),
					questionnaire_produce_single_multiple_choice_alternative_name(2, index+1)
				);
			});
debugger;

			var move_operation = questionnaire_move_section(questions_array[0], 1);
			assert.strictEqual(move_operation, true);

			$(alternatives_array[0]).each(function(index, alternative) {
				assert.strictEqual(
					$(alternative).children('input').attr('id'),
					questionnaire_produce_single_multiple_choice_alternative_name(2, index+1)
				);
			});

			$(alternatives_array[1]).each(function(index, alternative) {
				assert.strictEqual(
					$(alternative).children('input').attr('id'),
					questionnaire_produce_single_multiple_choice_alternative_name(1, index+1)
				);
			});
		});
		*/

		QUnit.module('Question number');

		QUnit.test('Only questions', function(assert) {
			var added_questions = [
				questionnaire_add_question(),
				questionnaire_add_question(),
				questionnaire_add_question()
			];

			assert.expect(2*added_questions.length);

			for (var i = 0; i < added_questions.length; i++) {
				assert.ok(added_questions[i]);
				assert.strictEqual(questionnaire_get_question_number(added_questions[i]), i + 1);
			}
		});

		QUnit.test('Interleaved questions and heading-and-descriptions', function(assert) {
			var added_sections = [
				questionnaire_add_heading_and_description(),
				questionnaire_add_question(),
				questionnaire_add_heading_and_description(),
				questionnaire_add_question(),
				questionnaire_add_heading_and_description(),
				questionnaire_add_question(),
				questionnaire_add_heading_and_description()
			];

			assert.expect(added_sections.length + 3);

			for (var i = 0; i < added_sections.length; i++) {
				assert.ok(added_sections[i]);
			}

			assert.strictEqual(questionnaire_get_question_number(added_sections[2]), 1);
			assert.strictEqual(questionnaire_get_question_number(added_sections[4]), 2);
			assert.strictEqual(questionnaire_get_question_number(added_sections[6]), 3);
		});
	});
}