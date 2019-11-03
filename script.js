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
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li><h3>${responseJson.data[i]}</h3><p>${responseJson.data[i]}</p></li>`
        )
    };
    $('#results').removeClass('hidden');
}

function getParks(query, maxResults = 10) {
    const params = {
        api_key: apiKey,
        q: query,
        maxResults
    };
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => console.log(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

}

function watchForm() {
    stateSelection();
    stateRequired();
    selectedState();
    $('form').submit(event => {
        event.preventDefault();
        const search = $('.checked').val();
        const maxResults = $('#max-results').val();
        getParks(search, maxResults);
    });
}
console.log(selectedStates);
$(watchForm);
