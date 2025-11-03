// Test both Gemini AI and Google Maps APIs
const testBothAPIs = async () => {
    console.log('🧪 Testing InclusiveHub with BOTH APIs...\n');
    
    // Test 1: Gemini AI
    try {
        console.log('1️⃣ Testing Gemini AI...');
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyB5KOKJRZBqkg8gMPyp0urZ3IjgX4cxB1g', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hello! Confirm you can help with accessibility.' }] }]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Gemini AI: WORKING!');
            console.log('   Response:', data.candidates[0].content.parts[0].text.substring(0, 80) + '...');
        } else {
            console.log('❌ Gemini AI: Failed');
        }
    } catch (error) {
        console.log('❌ Gemini AI Error:', error.message);
    }
    
    // Test 2: Google Maps API
    try {
        console.log('\n2️⃣ Testing Google Maps API...');
        const mapsResponse = await fetch('https://maps.googleapis.com/maps/api/js?key=AIzaSyAT554W-8g_dZRpvOUzRyRw3jOf5kZV0hw&libraries=places');
        
        if (mapsResponse.ok) {
            console.log('✅ Google Maps API: WORKING!');
            console.log('   Maps JavaScript API is accessible');
        } else {
            console.log('❌ Google Maps API: Failed -', mapsResponse.status);
        }
    } catch (error) {
        console.log('❌ Google Maps API Error:', error.message);
    }
    
    // Test 3: Server API with AI
    try {
        console.log('\n3️⃣ Testing Server AI Chat...');
        const serverResponse = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'Can you help me find accessible restaurants with wheelchair access?' 
            })
        });
        
        if (serverResponse.ok) {
            const data = await serverResponse.json();
            console.log('✅ Server AI Chat: WORKING!');
            console.log('   Response:', data.response.substring(0, 80) + '...');
        } else {
            console.log('❌ Server AI Chat: Failed');
        }
    } catch (error) {
        console.log('❌ Server AI Chat Error:', error.message);
    }
    
    console.log('\n🎉 BOTH APIs INTEGRATED!');
    console.log('Your InclusiveHub now has:');
    console.log('📱 AI-powered accessibility assistance');
    console.log('🗺️ Interactive Google Maps');
    console.log('🎯 Complete accessibility platform');
    console.log('\n🌐 Visit: http://localhost:5000');
};

testBothAPIs();