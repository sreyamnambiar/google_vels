// Direct Gemini API Test (no imports)
const testAPI = async () => {
    console.log('🔍 Testing Gemini API with your key...\n');
    
    // Test using basic fetch
    try {
        const apiKey = 'AIzaSyB5KOKJRZBqkg8gMPyp0urZ3IjgX4cxB1g';
        console.log('✅ API Key loaded');
        
        // Test Gemini API directly
        console.log('🧪 Testing Gemini API...');
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello! Say hi and confirm you are working for accessibility assistance.'
                    }]
                }]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ Gemini API: WORKING!');
            console.log('Response:', text.substring(0, 100) + '...');
            
            // Now test server API
            console.log('\n🌐 Testing server API...');
            
            const serverResponse = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: 'Hello! Can you help with accessibility?' 
                })
            });
            
            if (serverResponse.ok) {
                const serverData = await serverResponse.json();
                console.log('✅ Server API: WORKING!');
                console.log('Server Response:', serverData.response.substring(0, 100) + '...');
                console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
                console.log('InclusiveHub ready at: http://localhost:5000');
            } else {
                console.log('❌ Server API failed:', serverResponse.status);
            }
            
        } else {
            console.log('❌ Gemini API failed:', response.status);
            const error = await response.text();
            console.log('Error:', error);
        }
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
};

testAPI();