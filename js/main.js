$(document).ready( function() {

	var topics = ['Programming', 'JavaScript', 'Design', 'Data', 'Math'];

	function showSearchResults(title, subtitle, code, column) {
		$(column + ' > h3').text(title);
		$(column + ' > p').text(subtitle);
		$(column + ' > ul').html(code);
	}

	function clearSearchResults() {
		$('.api > h3').text('');
		$('.api > p').text('Loading...');
		$('.api > ul').html('');
	}

	function getSearchResults(searchTerm) {
		console.log('Search: ' + searchTerm);
		$('.message').html('<h2>Results for <span class="bold">' + searchTerm + '</span>:</h3>');

		var CourseraCount = 0,
		    UdacityCount = 0,
		    KhanCount = 0;

		function getUdacity() {

			$.getJSON("https://www.udacity.com/public-api/v0/courses", function(data) {
				var code = '';
			    $.each(data.courses, function(count) {
			    	var search = searchTerm.toLowerCase(),
			    	    title = data.courses[count].title,
			    	    lowerTitle = title.toLowerCase(),
			    	    subtitle = data.courses[count].subtitle,
			    	    lowerSubtitle = subtitle.toLowerCase(),
			    	    summary = data.courses[count].summary.toLowerCase(),
			    	    level = data.courses[count].level,
			    	    homepage = data.courses[count].homepage;
			    	if ( lowerTitle.indexOf(search) > -1 || lowerSubtitle.indexOf(search) > -1 || summary.indexOf(search) > -1 || homepage.indexOf(search) > -1) {
				        if ( UdacityCount < 5 ) {
				        	code += '<li><p class="bold"><a href="' + homepage + '">' + title + '</a></p><p>' + subtitle + '</p><p class="bold">Level: ' + level.substring(0,1).toUpperCase() + level.substring(1) + '</p>';				        	
				        }
				        UdacityCount ++;
				   	}
			    });
				if ( UdacityCount > 0 ) {
					showSearchResults('Udacity', 'Courses:', code, '.one');
				}
				else {
					showSearchResults('Udacity', 'No Results Found', '', '.one');
				}
			});

		}

		function getCoursera() {

			$.getJSON("https://api.coursera.org/api/catalog.v1/courses?fields=name,previewLink,shortDescription,aboutTheCourse,targetAudience", function(data) {
				var code = '';
			    $.each(data.elements, function(count) {
			    	var search = searchTerm.toLowerCase(), 
			    	    title = data.elements[count].name,
			    	    lowerTitle = title.toLowerCase(),
			    	    subtitle = data.elements[count].shortDescription,
			    	    lowerSubtitle = subtitle.toLowerCase(),
			    	    summary = data.elements[count].aboutTheCourse.toLowerCase(),
			    	    level = data.elements[count].targetAudience,
			    	    homepage = data.elements[count].previewLink || '';
			    	if ( level == 0 ) {
			    		var levelDisplay = 'Basic Undergraduate';
			    	}
			    	else if ( level == 1 ) {
			    		levelDisplay = 'Advanced Undergraduate or Beginning Graduate';
			    	}
			    	else if ( level == 2 ) {
			    		levelDisplay = 'Advanced Graduate';
			    	}
			    	else {
			    		levelDisplay = 'Other';
			    	}
			    	if ( lowerTitle.indexOf(search) > -1 || lowerSubtitle.indexOf(search) > -1 || summary.indexOf(search) > -1 || homepage.indexOf(search) > -1) {
				        if ( CourseraCount < 5 ) {
				        	if ( homepage === '' ) {
					        	code += '<li><p class="bold"><a target="_blank" href="https://www.coursera.org/courses?query=' + searchTerm + '">' + title + '</a></p><p>' + subtitle.substring(0,30) + '...</p><p class="bold">Level: ' + levelDisplay + '</p>';
				        	}
				        	else {
				        		code += '<li><p class="bold"><a target="_blank" href="' + homepage + '">' + title + '</a></p><p>' + subtitle.substring(0,30) + '...</p><p class="bold">Level: ' + levelDisplay + '</p>';				        	
				        	}
				        }
				        CourseraCount ++;
				   	}
			    });
				if ( CourseraCount > 0 ) {
					showSearchResults('Coursera', 'Courses:', code, '.two');
				}
				else {
					showSearchResults('Coursera', 'No Results Found', '', '.two');
				}
			});
		}


		function getKhan() {
			$.getJSON("http://www.khanacademy.org/api/v1/playlists", function(data) {
				var code = '';
			    $.each(data, function(count) {
			    	var search = searchTerm.toLowerCase(),
			    		title = data[count].title,
			    	    lowerTitle = title.toLowerCase(),
			    	    subtitle = data[count].description || data[count].translated_description || '',
			    	    lowerSubtitle = subtitle.toLowerCase(),
			    	    summary = data[count].aboutTheCourse || '',
			    	    summaryLower = summary.toLowerCase(),
			    	    type = data[count].kind,
			    	    homepage = data[count].ka_url || '';
			    	if ( lowerTitle.indexOf(search) > -1 || lowerSubtitle.indexOf(search) > -1 || summary.indexOf(search) > -1 || homepage.indexOf(search) > -1) {
				        if ( KhanCount < 5 ) {
				        	if ( homepage === '' ) {
					        	code += '<li><p class="bold"><a target="_blank" href="https://www.khanacademy.org/search?page_search_query=' + searchTerm + '">' + title + '</a></p><p>' + subtitle.substring(0,30) + '...</p><p class="bold">Type: ' + type + '</p>';
				        	}
				        	else {
				        		code += '<li><p class="bold"><a target="_blank" href="' + homepage + '">' + title + '</a></p><p>' + subtitle.substring(0,30) + '...</p><p class="bold">Type: ' + type + '</p>';				        	
				        	}
				        }
				        KhanCount ++;
				   	}
			    });
				if ( KhanCount > 0 ) {
					showSearchResults('Khan Academy', 'Topics:', code, '.three');
				}
				else {
					showSearchResults('Khan Academy', 'No Results Found', '', '.three');
				}
			});
		}

		getUdacity();
		getCoursera();
		getKhan();
	}

	$('.topic-search').submit( function(e) {
		clearSearchResults();
		e.preventDefault();
		$('.apis').show();
		var search = $('input:first').val();
		$('input:first').val('');
		getSearchResults(search);
	});

	$('.random').click( function(e) {
		e.preventDefault();
		var rand = topics[Math.floor(Math.random() * topics.length)];
		getSearchResults(rand);
		$('.apis').show();
	});

});