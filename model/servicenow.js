var requestify = require('requestify'); 



requestify.request('https://sso.saint-gobain.com/cas/login', {
    method: 'POST',
    // body: {
    //     foo: 'bar'
    //     bar: 'foo'
    // },
    headers: {
        'accept': 'application/json',
        'X-Forwarded-By': 'me'  
    },
    // cookies: {
    //     mySession: 'some cookie value'
    // },
    formdata: {
        username: 'A8859780',
        password: 'Pwd@123456'
    },
    dataType: 'json'        
})
.then(function(response) {
    // get the response body
    console.log('success');
    console.log(response);
    console.log(response.getBody());

    // get the response headers
    response.getHeaders();

    // get specific response header
    response.getHeader('Accept');

    // get the code
    response.getCode();

    // Get the response raw body
    response.body;
}).fail(function(response){
  console.log(response);
});