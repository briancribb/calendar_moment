var CM = {
	init: function(settings) {
		"use strict";
		CM.events = settings.events;
		CM.$targetCalendar = settings.$targetCalendar;
		var targetMoment = settings.targetMoment;


		CM.$targetCalendar.on( "click", ".cm_nav button", function( event ) {
			if ( $(this).hasClass('cm_prev') ) {
				targetMoment.month( targetMoment.month() - 1 );
			} else if ( $(this).hasClass('cm_next') ) {
				targetMoment.month( targetMoment.month() + 1 );
			} else if ( $(this).hasClass('cm_now') ) {
				targetMoment = moment();
			}
			CM.build(targetMoment);
		});
		CM.build(targetMoment);


		/*
		$(window).resize( $.debounce( 250, function() {
			CM.update();
		} ) );
		*/
	},
	build: function(targetMoment) {
		"use strict";
		var currentMoment	= targetMoment.clone(),
			headerString	= '<header class="cm_header"><div class="cm_title">' + targetMoment.format("MMMM, YYYY") + '</div><nav id="cm_nav" class="cm_nav"><button class="cm_prev button" disabled><< Prev</button><button class="cm_now button" disabled>Now</button><button class="cm_next button" disabled>Next >></button></nav></header>',
			openingString	= '<section class="cm_body">',
			weekdayString	= '<ul class="cm_weekdays"><li>Sunday</li><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li></ul>',
			weeksString		= '<ul class="cm_week">', // ul tag is closed after days are built.
			closingString	= '</section>'; // Closes cm_body and cm_body.

		var calendarString	= headerString + openingString + weekdayString + weeksString,
			dayString		= '',
			thisMonth		= currentMoment.month(),
			daysInThisMonth	= currentMoment.daysInMonth(),
			lastWeekdayNum	= currentMoment.date( currentMoment.daysInMonth() ).weekday(),	//Careful. Sets the current month to it's last day.
			firstWeekdayNum	= currentMoment.date(1).weekday();								// Careful. Sets the current month to first day. Important to do this second!

		var dayCounter		= 1 - firstWeekdayNum, // Starting current Day as the first day on the calendar.
			lastDay			= (6 - lastWeekdayNum) + daysInThisMonth, // calendar starts at 1, not zero.
			totalDays		= lastDay + firstWeekdayNum;

		currentMoment.date(dayCounter); // Sets the first calendar cell to the appropriate day.


		for (var i = 0; i < totalDays; i++) {
			var extraClasses = '',
				calendarEvent = buildEvents( parseInt( currentMoment.format("YYYYMMDD") ) );
			if ( dayCounter < 1 || dayCounter > daysInThisMonth ) {
				extraClasses += ' out_of_range';
			}
			extraClasses += (calendarEvent.hasEvent === true) ? ' has_event' : ' no_event'

			var dayString =	'<li class="cm_day' + extraClasses + '">' + 
								'<div class="cm_day-cell">' + 
									'<div class="cm_date">' + 
										'<span class="cm_date--title">' +
											currentMoment.format("dddd") + ', ' + 
											currentMoment.format("MMM") + ' ' + 
											currentMoment.format("Do") +
										'</span>' + 
										'<span class="cm_date--int">' + currentMoment.format("D") + '</span>' + 
									'</div>' +
									calendarEvent.eventString + 
								'</div>' + 
							'</li>';

			if ( (i +1) % 7 === 0 && dayCounter < daysInThisMonth) {
				dayString += '</ul><ul class="cm_week">';
			}
			dayCounter ++;
			calendarString += dayString;

			currentMoment.add(1,'days');
		}
		calendarString += ('</ul>' + closingString);
		CM.$targetCalendar.addClass('cm').html( calendarString ).find('.cm_body');


		function buildEvents( currentMomentInt ) {
			var eventString = '',
				eventIndex = 0,
				buildEventMarkup = function(index, classToAdd) {
					//console.log('buildEventMarkup() index: ' + index + ', CM.events[index].summary: ' + CM.events[index].summary);
					//console.log('-' + index + '-');
					//return '<!-- Event Markup -->';

					return	'<div class="cm_event' + classToAdd + '" data-event-index="' + index + '">' + 
								'<div class="cm_event__content">' + 
									'<div class="cm_event__title">' + 
										'<a class="cm_event__link" target="_blank" href="' + CM.events[index].url + '">' + CM.events[index].summary + '</a>' + 
									'</div>' + 
									//'<div class="cm_event__location">' + CM.events[index].location + '</div>' + 
									//'<div class="cm_event__desc"></div>' + 
								'</div>' + 
							'</div>';

				};

			for (var j = 0; j < CM.events.length; j++) {
				var eventStartInt		= parseInt( moment(CM.events[j].startTime).format("YYYYMMDD") );
					//eventEndInt			= parseInt( moment(CM.events[j].endTime).format("YYYYMMDD") );
				if ( currentMomentInt === eventStartInt ) {
					eventString += buildEventMarkup(j, '');
				}
			}
			//eventString += eventString;
			var hasEvent = (eventString === '') ? false : true;
			return {hasEvent:hasEvent, eventString:eventString};
		}

		function initBuild() {
			// Check buttons to see if they should be enabled.
			var rightNow = moment(),
				$btnPrev = CM.$targetCalendar.find('#cm_nav .cm_prev'),
				$btnNow = CM.$targetCalendar.find('#cm_nav .cm_now'),
				$btnNext = CM.$targetCalendar.find('#cm_nav .cm_next');

			if ( targetMoment.month() ===  rightNow.month() ) {
				$btnPrev.prop('disabled', true).addClass('alt');
				$btnNow.prop('disabled', true).addClass('alt');
				$btnNext.prop('disabled', false).removeClass('alt');
			}
			else if ( moment( targetMoment ).isBefore( rightNow ) ) {
				$btnPrev.prop('disabled', true).addClass('alt');
				$btnNow.prop('disabled', false).removeClass('alt');
				$btnNext.prop('disabled', false).removeClass('alt');
			}
			else if ( moment( targetMoment ).isAfter( rightNow ) ) {
				$btnPrev.prop('disabled', false).removeClass('alt');
				$btnNow.prop('disabled', false).removeClass('alt');
				$btnNext.prop('disabled', false).removeClass('alt');
			}
			CM.$dayCells = CM.$targetCalendar.find('.cm_day');
			CM.$eventCells = CM.$targetCalendar.find('.cm_event');
			CM.update();
		}
		return initBuild(); // Fires initBuild() as the function finishes and returns.
	},
	equalHeight: function(clearValue) {
		"use strict";
		var tallest = 0;

		function checkHeight($target) {
			var thisHeight = $target.height();
			if(thisHeight > tallest) {
				tallest = thisHeight;
			}
		}

		if (clearValue) {
			CM.$dayCells.removeAttr('height');
			CM.$eventCells.removeAttr('height');
		} else {
			CM.$dayCells.each(function() {
				checkHeight( $(this) );
				$(this).attr( 'data-num-events', $(this).find('.cm_event').length );
			}).css('min-height',tallest);
		}


		tallest = 0; // reseting tallest so we can do the day cells.

		//CM.$eventCells.each(function() {
		//	checkHeight( $(this) );
		//	var myIndex = $(this).closest('.cm_day').find('.cm_event').index( $(this) );
		//	console.log('myIndex = ' + myIndex);
		//}).css('min-height',tallest);
	},
	update: function() {
		if ( !$('.cm_body .has_event').is(':visible') ) {
			CM.$targetCalendar.addClass('month_no_events');
		} else {
			CM.$targetCalendar.removeClass('month_no_events');
		}
		if ( $('.cm_body .has_event').is(':visible') ) {
			CM.equalHeight(true);
		} else {

		}
	}
}