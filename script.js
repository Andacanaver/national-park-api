'use strict';

const apiKey = 'lpV9VLSjPVcSsDIqnNdvyGW7aTvMxsiOiX5VlkJL';
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
let selectedStates = [];

function stateSelection() {
    for (let i = 0; i < states.length; i++) {
        $('#state-list').append(
            `<li><label for="${states[i]}">${states[i]}</label><input type="checkbox" id="${states[i]}" name="${states[i]}" value="${states[i]}" required></li>`)
    };
}

function statesSelected() {
    $("input[name='options[]']:checked").each(function () {
        selectedStates.push(parseInt($(this).val()));
    });
}
let checkedVals = $('.checked:checkbox:checked').map(function () {
    return this.value;
}).get();

function stateRequired() {
    let requiredCheckboxes = $(':checkbox[required]');
    requiredCheckboxes.change(function () {
        if (requiredCheckboxes.is(':checked')) {
            requiredCheckboxes.removeAttr('required');
        } else {
            requiredCheckboxes.attr('required', 'required');
        }
    });
};

function selectedState() {
    $(':checkbox').click(function () {
        if ($(this).is(":checked")) {
            $(this).addClass("checked");
        } else {
            $(this).removeClass("checked");
        }
    });
    $('input.checked').each(function () {
        selectedStates.push($(this).val());
    });
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    $('#results-list').empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        let park = responseJson.data[i];
        $('#results-list').append(
            `<li><h3>${park.fullName}</h3><p><span>Description:</span> ${park.description}</p><p><span>URL:</span> <a href="${park.url}" target="_blank">${park.url}</a></p></li>`
        );
    };
    $('#results').removeClass('hidden');
}

function getParks(query, maxResults = 10) {
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: maxResults
    };
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

}

function watchForm() {
    stateSelection();
    stateRequired();
    selectedState();
    statesSelected();
    $('form').submit(event => {
        event.preventDefault();
        const search = $('.checked:checkbox:checked').map(function () {
            return this.value;
        }).get();
        const maxResults = $('#max-results').val();
        getParks(search, maxResults);
    });
}
$(watchForm);
