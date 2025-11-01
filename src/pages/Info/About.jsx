import './info.css'



function About (){

    return(
        <>
     

       <div className = "About-us">
            <h1>About <span>Us</span></h1>
            <hr />
       </div>

       <div class="who-we-are">
            
            <div className="text-side">
                <h2>Who we <span>Are</span></h2>
                <hr />
                <p>
                Chronica is a Creative Content Management and Distribution System for authors, creators, and publishers. Streamline your storytelling, track readership, and distribute content seamlessly.

                Manage and organize your stories
                Track chapter updates and analytics
                Engage with your audience
                Distribute content across multiple platforms
                </p>

                  <div className="how-we-started">
                    <h2> How we <span>Started</span> </h2>
                    <hr />
                    <p>Chronica started as a simple idea to help creators manage and share their stories more easily. 
                        We saw how hard it was for authors to track updates, connect with readers, and distribute content across platforms. 
                        So, we built Chronica a creative system that streamlines storytelling, organizes content, and empowers creators to focus on what they do best telling great stories.
                    </p>
                </div>
            </div>
          
            <div class="image-side">
                <img src="src/assets/Mythryl.png" alt="logo" />
            </div>

        </div>


        <div className="our-mission">
            <h2> Our <span>Mission</span></h2>
            <p>Our mission is to empower authors, creators, and publishers by providing a simple and smart platform to manage stories, track readership, and share content effortlessly.
                 Chronica aims to make storytelling easier, more organized, and more connected for everyone.</p>
        </div>

        <div className="pang-yabang">

            <div className="p-story">   
                <h3>110k+</h3>
                <p>Published Story</p>

            </div>

            <div className="Users">
                <h3>100k++</h3>
                <p>Users</p>

            </div>

            <div className="p-story">
                <h3>Innovation in 
                    <br />
                    Digital Publishing</h3>
                

            </div>

              <div className="p-story">
                <h3>Best in 
                    <br />
                    Chismis 2025</h3>
                

            </div>

        </div>

        <div>
            <hr className="line" />
        </div>

        <div className="get-started">
            <h2>Get Started  <span>and Grow</span></h2>
        </div>

        <div className="Cards">

            <div className="card-container">
                <h3>Publishing Guidelines</h3>
                <i id="icon-book" class="fa-solid fa-book"></i>
                <p id="description">Discover Chronica’s publishing standards designed to help creators share their stories responsibly and beautifully.
                     Learn how to format your work, follow community rules, and make sure every story reaches readers the right way.</p>
                <p><u>Read More</u></p>
            </div>

            <div className="card-container">
                <h3>Create your Story</h3>
                <i id='icon-pencil' class="fa-solid fa-pencil"></i>
                <p id="description">Bring your ideas to life with Chronica’s easy-to-use tools. 
                    Write, edit, and organize your stories and chapters all in one place helping you focus on creativity while keeping everything neatly managed.</p>
                <p><u>Read More</u></p>
            </div>

            <div className="card-container">
                <h3>Share and Grow</h3>
                <i id='icon-globe' class="fa-solid fa-globe"></i>
                <p id="description">Share your stories with the world and connect with readers who love your work. 
                    Chronica makes it simple to distribute your content across platforms, track engagement, and grow your creative presence.</p>
                <p><u>Read More</u></p>
            </div>

        </div>
        </>

        
        
    );
}

export default About