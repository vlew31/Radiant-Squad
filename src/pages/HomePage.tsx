import { Navbar } from "../components/Navbar";
import "../styles/Pages.css";

export const HomePage = () => {
  return (
    <div>
      <Navbar currentPath="/" />
      <div className="page-container">
        <div className="page-content">
          <div className="home-container">
            <h1>Urban Gardener</h1>
            <p className="home-subtitle">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam accusantium repellendus pariatur laborum ab sint rerum, voluptatem quisquam quam. Unde accusantium architecto ipsa id fuga vero quam pariatur repudiandae accusamus? 
            </p>
            
            <div className="features-container">
              <div className="feature-card">
                <h2 className="feature-title">Feature 1</h2>
                <p className="feature-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam accusantium repellendus pariatur laborum ab sint rerum, voluptatem quisquam quam. Unde accusantium architecto ipsa id fuga vero quam pariatur repudiandae accusamus? 
                </p>
              </div>
              
              <div className="feature-card">
                <h2 className="feature-title">Feature 2</h2>
                <p className="feature-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam accusantium repellendus pariatur laborum ab sint rerum, voluptatem quisquam quam. Unde accusantium architecto ipsa id fuga vero quam pariatur repudiandae accusamus? 
                </p>
              </div>
              
              <div className="feature-card">
                <h2 className="feature-title">Feature 3</h2>
                <p className="feature-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam accusantium repellendus pariatur laborum ab sint rerum, voluptatem quisquam quam. Unde accusantium architecto ipsa id fuga vero quam pariatur repudiandae accusamus? 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 