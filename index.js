const data = require('./data');

function constructResponse(type, value) {
    const baseResponse = {
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": "I did not understand the enquiry, lord"
            },
            "card": {
                "type": "Simple",
                "title": "",
                "content": ""
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": null
                }
            },
            "shouldEndSession": true
        }
    };
    
    if (!type) return baseResponse;
    if (type === 'numToTitle') {
        const book = data.find(book => book.number === value);
        if (!book) return {
            ...baseResponse,
            response: {
                ...baseResponse.response,
                outputSpeech: {
                    ...baseResponse.response.outputSpeech,
                    text: `My lord, I am unable to find any book with the number ${value}. I fear the knowledge it contained has been lost to humanity`
                }
            }
        };
        
        const title = book.title;
        return {
            ...baseResponse,
            response: {
                ...baseResponse.response,
                outputSpeech: {
                    ...baseResponse.response.outputSpeech,
                    text: `By his majesty the God-Emporer of mankind, book number ${value} is titled '${title}'`
                },
                card: {
                    ...baseResponse.response.card,
                    title: 'Book number to title',
                    content: `Book number ${value} is titled '${title}'`
                }
            }
        };
    }
    
}

exports.handler = (event, ctx, callback) => {
        const slots = event && event.request && event.request.intent && event.request.intent.slots;
        if (!slots) return callback(new Error('No slots in the request'));

        const requestedSlots = Object.keys(slots).filter(slot => !!slots[slot].value);
        console.log('requested slots', requestedSlots);

        if (requestedSlots.length === 1 && requestedSlots.includes('number')) {
            // User wants to know the title of the book given the number
            const numValue = Number(slots.number.value);
            const response = constructResponse('numToTitle', numValue);

            return callback(null, response);
        }

        return callback(null, constructResponse());
};
