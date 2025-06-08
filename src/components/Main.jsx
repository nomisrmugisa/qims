// components/Main.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import './Main.css';

const Main = () => {
  return (
    <main className="main">

        {/* Hero Section  */}
        <section id="hero" className="hero section light-background">

          <img src="assets/img/hero-bg.jpg" alt="" data-aos="fade-in"></img>

          <div className="container position-relative">

            <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
              <h2>GOVERNMENT / PUBLIC FACILITY SURVEYS & ASSESSMENT</h2>
              <p>Health Facility survey and assessment platform to facilitate the planning, execution, and reporting of health-related surveys and assessments. The module supports national health assessments, facility-based surveys, and specialized research studies conducted by the HI, DHS, and other relevant stakeholders.</p>
            </div>{/* End Welcome */}

            <div className="content row gy-4">
              <div className="col-lg-4 d-flex align-items-stretch">
                <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
                  <h3>PRIVATE FACILITY INSPECTION & LICENSING</h3>
                  <p>
                  The Health Facility Licensing Platform is an innovative system that revolutionizes the licensing process for health facilities. It offers a user-friendly solution, enhancing accessibility, transparency, and efficiency. This platform reduces processing time, minimizes required documentation, and eliminates physical visits to regulatory offices. With real-time application tracking and seamless integrations, it sets a new standard for transparency and accountability, improving healthcare service delivery and ensuring regulatory compliance.
                  </p>
                  <div className="text-center">
                    <a href="#about" className="more-btn"><span>Learn More</span> <i className="bi bi-chevron-right"></i></a>
                  </div>
                </div>
              </div>{/* End Why Box */}

              <div className="col-lg-8 d-flex align-items-stretch">
                <div className="d-flex flex-column justify-content-center">
                  <div className="row gy-4">

                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                        <i className="bi bi-clipboard-data"></i>
                        <h4>New Facility</h4>
                        <p>Applying for New Services in Health Facility. It is an additional services in the existing facility.</p>
                      </div>
                    </div>{/* End Icon Box */}

                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                        <i className="bi bi-gem"></i>
                        <h4>Upgrade</h4>
                        <p>Authorization for Upgrade from one category of Health Facility to Another. It is a service requested by Private Health Facilities after fullfulling the requirements to change the category.</p>
                      </div>
                    </div>{/* End Icon Box */}

                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                        <i className="bi bi-inboxes"></i>
                        <h4>Inspection Request</h4>
                        <p>Request for Inspection of New Health Facility. This service is for an entity holding provisional authorization for the registration of a health facility. Inspections shall be conducted twice a year</p>
                      </div>
                    </div>{/* End Icon Box */}

                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                        <i className="bi bi-inboxes"></i>
                        <h4>Request to amment Staff list</h4>
                        <p>Request to Add Staff. This is done when there is a changing in staffing.</p>
                      </div>
                    </div>{/* End Icon Box */}

                  </div>
                </div>
              </div>
            </div>{/* End  Content*/}

          </div>

        </section>{/* /Hero Section */}

        {/* About Section */}
        <section id="about" className="about section">

          <div className="container">

            <div className="row gy-4 gx-5">

              <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="200">
                <div style={{ position: 'relative' }}>
                  <img src="assets/img/about.jpg" className="img-fluid" alt="" />
                  <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" className="glightbox pulsating-play-btn"></a>
                </div>
              </div>

              <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
                <h3>About Us</h3>
                <p>
                  Dolor iure expedita id fuga asperiores qui sunt consequatur minima. Quidem voluptas deleniti. Sit quia molestiae quia quas qui magnam itaque veritatis dolores. Corrupti totam ut eius incidunt reiciendis veritatis asperiores placeat.
                </p>
                <ul>
                  <li>
                    <i className="fa-solid fa-vial-circle-check"></i>
                    <div>
                      <h5>Ullamco laboris nisi ut aliquip consequat</h5>
                      <p>Magni facilis facilis repellendus cum excepturi quaerat praesentium libre trade</p>
                    </div>
                  </li>
                  <li>
                    <i className="fa-solid fa-pump-medical"></i>
                    <div>
                      <h5>Magnam soluta odio exercitationem reprehenderi</h5>
                      <p>Quo totam dolorum at pariatur aut distinctio dolorum laudantium illo direna pasata redi</p>
                    </div>
                  </li>
                  <li>
                    <i className="fa-solid fa-heart-circle-xmark"></i>
                    <div>
                      <h5>Voluptatem et qui exercitationem</h5>
                      <p>Et velit et eos maiores est tempora et quos dolorem autem tempora incidunt maxime veniam</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </section>{/* /About Section */}

        {/* Stats Section */}
        <section id="stats" className="stats section light-background">

          <div className="container" data-aos="fade-up" data-aos-delay="100">

            <div className="row gy-4">

              <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                <i className="fa-solid fa-user-doctor"></i>
                <div className="stats-item">
                  <span data-purecounter-start="0" data-purecounter-end="85" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Doctors</p>
                </div>
              </div>{/* End Stats Item */}

              <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                <i className="fa-regular fa-hospital"></i>
                <div className="stats-item">
                  <span data-purecounter-start="0" data-purecounter-end="18" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Departments</p>
                </div>
              </div>{/* End Stats Item */}

              <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                <i className="fas fa-flask"></i>
                <div className="stats-item">
                  <span data-purecounter-start="0" data-purecounter-end="12" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Research Labs</p>
                </div>
              </div>{/* End Stats Item */}

              <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                <i className="fas fa-award"></i>
                <div className="stats-item">
                  <span data-purecounter-start="0" data-purecounter-end="150" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Awards</p>
                </div>
              </div>{/* End Stats Item */}

            </div>

          </div>

        </section>{/* /Stats Section */}

        {/* Services Section */}
        <section id="services" className="services section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Services</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="container">

            <div className="row gy-4">

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="service-item  position-relative">
                  <div className="icon">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Nesciunt Mete</h3>
                  </a>
                  <p>Provident nihil minus qui consequatur non omnis maiores. Eos accusantium minus dolores iure perferendis tempore et consequatur.</p>
                </div>
              </div>{/* End Service Item */}

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className="fas fa-pills"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Eosle Commodi</h3>
                  </a>
                  <p>Ut autem aut autem non a. Sint sint sit facilis nam iusto sint. Libero corrupti neque eum hic non ut nesciunt dolorem.</p>
                </div>
              </div>{/* End Service Item */}

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className="fas fa-hospital-user"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Ledo Markt</h3>
                  </a>
                  <p>Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus ea aut. Vel qui id voluptas adipisci eos earum corrupti.</p>
                </div>
              </div>{/* End Service Item */}

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className="fas fa-dna"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Asperiores Commodit</h3>
                  </a>
                  <p>Non et temporibus minus omnis sed dolor esse consequatur. Cupiditate sed error ea fuga sit provident adipisci neque.</p>
                  <a href="#" className="stretched-link"></a>
                </div>
              </div>{/* End Service Item */}

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className="fas fa-wheelchair"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Velit Doloremque</h3>
                  </a>
                  <p>Cumque et suscipit saepe. Est maiores autem enim facilis ut aut ipsam corporis aut. Sed animi at autem alias eius labore.</p>
                  <a href="#" className="stretched-link"></a>
                </div>
              </div>{/* End Service Item */}

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className="fas fa-notes-medical"></i>
                  </div>
                  <a href="#" className="stretched-link">
                    <h3>Dolori Architecto</h3>
                  </a>
                  <p>Hic molestias ea quibusdam eos. Fugiat enim doloremque aut neque non et debitis iure. Corrupti recusandae ducimus enim.</p>
                  <a href="#" className="stretched-link"></a>
                </div>
              </div>{/* End Service Item */}

            </div>

          </div>

        </section>{/* /Services Section */}

        {/* Registration Section */}
        <section id="Registration" className="Registration section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Registration</h2>
            <p>Register your health facility to begin the licensing process</p>
          </div>{/* End Section Title */}

          <div className="container" data-aos="fade-up" data-aos-delay="100">

            <form role="form" className="php-email-form">
              {/* Facility Profile Section */}
              <div className="row">
                <div className="col-md-12">
                  <h4>Facility Profile</h4>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <input type="text" name="facility" className="form-control" id="facility" placeholder="Facility Name" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="text" name="locationInBotswana" className="form-control" id="location" placeholder="Location in Botswana (Ward)" required></input>
                </div>
              </div>

              {/* User Profile Section */}
              <div className="row mt-4">
                <div className="col-md-12">
                  <h4>User Profile</h4>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <input type="text" name="userName" className="form-control" id="username" placeholder="Preferred User Name" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="text" name="physicalAddress" className="form-control" id="address" placeholder="Physical Address" required></input>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 form-group">
                  <input type="text" name="firstName" className="form-control" id="firstname" placeholder="First Name" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="text" name="surname" className="form-control" id="surname" placeholder="Surname" required></input>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 form-group">
                  <input type="text" name="correspondenceAddress" className="form-control" id="correspondence" placeholder="Correspondence Address (Town/Village)" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="email" name="email" className="form-control" id="email" placeholder="Email" required></input>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 form-group">
                  <input type="tel" name="cellNumber" className="form-control" id="phone" placeholder="Phone Number" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="text" name="BHPCRegistrationNumber" className="form-control" id="bhpc" placeholder="B H.P.C Registration Number" required></input>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 form-group">
                  <input type="text" name="privatePracticeNumber" className="form-control" id="practice" placeholder="Private Practice Number" required></input>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="file" name="attachments" className="form-control" id="attachments" placeholder="Attachments"></input>
                </div>
              </div>

              <div className="mt-4">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">Your registration request has been submitted successfully. Thank you!</div>
                <div className="text-center register-btns" >
                  <button type="button" className="btn-submit">Register</button>
                  <button type="button" className="btn-cancel">Cancel</button>
                </div>
              </div>
            </form>

          </div>

        </section>{/* /Registration Section */}

        {/* Departments Section */}
        <section id="departments" className="departments section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Departments</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="container" data-aos="fade-up" data-aos-delay="100">

            <div className="row">
              <div className="col-lg-3">
                <ul className="nav nav-tabs flex-column">
                  <li className="nav-item">
                    <a className="nav-link active show" data-bs-toggle="tab" href="#departments-tab-1">Cardiology</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#departments-tab-2">Neurology</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#departments-tab-3">Hepatology</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#departments-tab-4">Pediatrics</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#departments-tab-5">Eye Care</a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-9 mt-4 mt-lg-0">
                <div className="tab-content">
                  <div className="tab-pane active show" id="departments-tab-1">
                    <div className="row">
                      <div className="col-lg-8 details order-2 order-lg-1">
                        <h3>Cardiology</h3>
                        <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                        <p>Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero</p>
                      </div>
                      <div className="col-lg-4 text-center order-1 order-lg-2">
                        <img src="assets/img/departments-1.jpg" alt="" className="img-fluid"></img>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="departments-tab-2">
                    <div className="row">
                      <div className="col-lg-8 details order-2 order-lg-1">
                        <h3>Et blanditiis nemo veritatis excepturi</h3>
                        <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                        <p>Ea ipsum voluptatem consequatur quis est. Illum error ullam omnis quia et reiciendis sunt sunt est. Non aliquid repellendus itaque accusamus eius et velit ipsa voluptates. Optio nesciunt eaque beatae accusamus lerode pakto madirna desera vafle de nideran pal</p>
                      </div>
                      <div className="col-lg-4 text-center order-1 order-lg-2">
                        <img src="assets/img/departments-2.jpg" alt="" className="img-fluid"></img>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="departments-tab-3">
                    <div className="row">
                      <div className="col-lg-8 details order-2 order-lg-1">
                        <h3>Impedit facilis occaecati odio neque aperiam sit</h3>
                        <p className="fst-italic">Eos voluptatibus quo. Odio similique illum id quidem non enim fuga. Qui natus non sunt dicta dolor et. In asperiores velit quaerat perferendis aut</p>
                        <p>Iure officiis odit rerum. Harum sequi eum illum corrupti culpa veritatis quisquam. Neque necessitatibus illo rerum eum ut. Commodi ipsam minima molestiae sed laboriosam a iste odio. Earum odit nesciunt fugiat sit ullam. Soluta et harum voluptatem optio quae</p>
                      </div>
                      <div className="col-lg-4 text-center order-1 order-lg-2">
                        <img src="assets/img/departments-3.jpg" alt="" className="img-fluid"></img>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="departments-tab-4">
                    <div className="row">
                      <div className="col-lg-8 details order-2 order-lg-1">
                        <h3>Fuga dolores inventore laboriosam ut est accusamus laboriosam dolore</h3>
                        <p className="fst-italic">Totam aperiam accusamus. Repellat consequuntur iure voluptas iure porro quis delectus</p>
                        <p>Eaque consequuntur consequuntur libero expedita in voluptas. Nostrum ipsam necessitatibus aliquam fugiat debitis quis velit. Eum ex maxime error in consequatur corporis atque. Eligendi asperiores sed qui veritatis aperiam quia a laborum inventore</p>
                      </div>
                      <div className="col-lg-4 text-center order-1 order-lg-2">
                        <img src="assets/img/departments-4.jpg" alt="" className="img-fluid"></img>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="departments-tab-5">
                    <div className="row">
                      <div className="col-lg-8 details order-2 order-lg-1">
                        <h3>Est eveniet ipsam sindera pad rone matrelat sando reda</h3>
                        <p className="fst-italic">Omnis blanditiis saepe eos autem qui sunt debitis porro quia.</p>
                        <p>Exercitationem nostrum omnis. Ut reiciendis repudiandae minus. Omnis recusandae ut non quam ut quod eius qui. Ipsum quia odit vero atque qui quibusdam amet. Occaecati sed est sint aut vitae molestiae voluptate vel</p>
                      </div>
                      <div className="col-lg-4 text-center order-1 order-lg-2">
                        <img src="assets/img/departments-5.jpg" alt="" className="img-fluid"></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>{/* /Departments Section */}

        {/* Doctors Section */}
        <section id="doctors" className="doctors section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Doctors</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="container">

            <div className="row gy-4">

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <div className="team-member d-flex align-items-start">
                  <div className="pic"><img src="assets/img/doctors/doctors-1.jpg" className="img-fluid" alt=""></img></div>
                  <div className="member-info">
                    <h4>Walter White</h4>
                    <span>Chief Medical Officer</span>
                    <p>Explicabo voluptatem mollitia et repellat qui dolorum quasi</p>
                    <div className="social">
                      <a href=""><i className="bi bi-twitter-x"></i></a>
                      <a href=""><i className="bi bi-facebook"></i></a>
                      <a href=""><i className="bi bi-instagram"></i></a>
                      <a href=""> <i className="bi bi-linkedin"></i> </a>
                    </div>
                  </div>
                </div>
              </div>{/* End Team Member */}

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                <div className="team-member d-flex align-items-start">
                  <div className="pic"><img src="assets/img/doctors/doctors-2.jpg" className="img-fluid" alt=""></img></div>
                  <div className="member-info">
                    <h4>Sarah Jhonson</h4>
                    <span>Anesthesiologist</span>
                    <p>Aut maiores voluptates amet et quis praesentium qui senda para</p>
                    <div className="social">
                      <a href=""><i className="bi bi-twitter-x"></i></a>
                      <a href=""><i className="bi bi-facebook"></i></a>
                      <a href=""><i className="bi bi-instagram"></i></a>
                      <a href=""> <i className="bi bi-linkedin"></i> </a>
                    </div>
                  </div>
                </div>
              </div>{/* End Team Member */}

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
                <div className="team-member d-flex align-items-start">
                  <div className="pic"><img src="assets/img/doctors/doctors-3.jpg" className="img-fluid" alt=""></img></div>
                  <div className="member-info">
                    <h4>William Anderson</h4>
                    <span>Cardiology</span>
                    <p>Quisquam facilis cum velit laborum corrupti fuga rerum quia</p>
                    <div className="social">
                      <a href=""><i className="bi bi-twitter-x"></i></a>
                      <a href=""><i className="bi bi-facebook"></i></a>
                      <a href=""><i className="bi bi-instagram"></i></a>
                      <a href=""> <i className="bi bi-linkedin"></i> </a>
                    </div>
                  </div>
                </div>
              </div>{/* End Team Member */}

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
                <div className="team-member d-flex align-items-start">
                  <div className="pic"><img src="assets/img/doctors/doctors-4.jpg" className="img-fluid" alt=""></img></div>
                  <div className="member-info">
                    <h4>Amanda Jepson</h4>
                    <span>Neurosurgeon</span>
                    <p>Dolorum tempora officiis odit laborum officiis et et accusamus</p>
                    <div className="social">
                      <a href=""><i className="bi bi-twitter-x"></i></a>
                      <a href=""><i className="bi bi-facebook"></i></a>
                      <a href=""><i className="bi bi-instagram"></i></a>
                      <a href=""> <i className="bi bi-linkedin"></i> </a>
                    </div>
                  </div>
                </div>
              </div>{/* End Team Member */}

            </div>

          </div>

        </section>{/* /Doctors Section */}

        {/* Faq Section */}
        <section id="faq" className="faq section light-background">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="container">

            <div className="row justify-content-center">

              <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">

                <div className="faq-container">

                  <div className="faq-item faq-active">
                    <h3>Non consectetur a erat nam at lectus urna duis?</h3>
                    <div className="faq-content">
                      <p>Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                  <div className="faq-item">
                    <h3>Feugiat scelerisque varius morbi enim nunc faucibus?</h3>
                    <div className="faq-content">
                      <p>Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                  <div className="faq-item">
                    <h3>Dolor sit amet consectetur adipiscing elit pellentesque?</h3>
                    <div className="faq-content">
                      <p>Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                  <div className="faq-item">
                    <h3>Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla?</h3>
                    <div className="faq-content">
                      <p>Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                  <div className="faq-item">
                    <h3>Tempus quam pellentesque nec nam aliquam sem et tortor?</h3>
                    <div className="faq-content">
                      <p>Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit turpis cursus in</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                  <div className="faq-item">
                    <h3>Perspiciatis quod quo quos nulla quo illum ullam?</h3>
                    <div className="faq-content">
                      <p>Enim ea facilis quaerat voluptas quidem et dolorem. Quis et consequatur non sed in suscipit sequi. Distinctio ipsam dolore et.</p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>{/* End Faq item*/}

                </div>

              </div>{/* End Faq Column*/}

            </div>

          </div>

        </section>{/* /Faq Section */}

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials section">

          <div className="container">

            <div className="row align-items-center">

              <div className="col-lg-5 info" data-aos="fade-up" data-aos-delay="100">
                <h3>Testimonials</h3>
                <p>
                  Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>

              <div className="col-lg-7" data-aos="fade-up" data-aos-delay="200">

                <Swiper
                  modules={[Pagination, Autoplay]}
                  loop={true}
                  speed={600}
                  autoplay={{ delay: 5000 }}
                  slidesPerView="auto"
                  pagination={{ clickable: true }}
                >
                  <SwiperSlide>
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img src="assets/img/testimonials/testimonials-1.jpg" className="testimonial-img flex-shrink-0" alt=""></img>
                        <div>
                          <h3>Saul Goodman</h3>
                          <h4>Ceo &amp; Founder</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img src="assets/img/testimonials/testimonials-2.jpg" className="testimonial-img flex-shrink-0" alt=""></img>
                        <div>
                          <h3>Sara Wilsson</h3>
                          <h4>Designer</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img src="assets/img/testimonials/testimonials-3.jpg" className="testimonial-img flex-shrink-0" alt=""></img>
                        <div>
                          <h3>Jena Karlis</h3>
                          <h4>Store Owner</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img src="assets/img/testimonials/testimonials-4.jpg" className="testimonial-img flex-shrink-0" alt=""></img>
                        <div>
                          <h3>Matt Brandon</h3>
                          <h4>Freelancer</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img src="assets/img/testimonials/testimonials-5.jpg" className="testimonial-img flex-shrink-0" alt=""></img>
                        <div>
                          <h3>John Larson</h3>
                          <h4>Entrepreneur</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.</span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </SwiperSlide>
                </Swiper>

              </div>

            </div>

          </div>

        </section>{/* /Testimonials Section */}

        {/* Gallery Section */}
        <section id="gallery" className="gallery section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Gallery</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">

            <div className="row g-0">

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-1.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-1.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-2.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-2.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-3.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-3.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-4.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-4.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-5.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-5.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-6.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-6.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-7.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-7.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

              <div className="col-lg-3 col-md-4">
                <div className="gallery-item">
                  <a href="assets/img/gallery/gallery-8.jpg" className="glightbox" data-gallery="images-gallery">
                    <img src="assets/img/gallery/gallery-8.jpg" alt="" className="img-fluid"></img>
                  </a>
                </div>
              </div>{/* End Gallery Item */}

            </div>

          </div>

        </section>{/* /Gallery Section */}

        {/* Contact Section */}
        <section id="contact" className="contact section">

          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Contact</h2>
            <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
          </div>{/* End Section Title */}

          <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
            <iframe
              style={{ border: 0, width: "100%", height: "270px" }}
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>{/* End Google Maps */}

          <div className="container" data-aos="fade-up" data-aos-delay="100">

            <div className="row gy-4">

              <div className="col-lg-4">
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                  <i className="bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3>Location</h3>
                    <p>A108 Adam Street, New York, NY 535022</p>
                  </div>
                </div>{/* End Info Item */}

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                  <i className="bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3>Call Us</h3>
                    <p>+1 5589 55488 55</p>
                  </div>
                </div>{/* End Info Item */}

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="500">
                  <i className="bi bi-envelope flex-shrink-0"></i>
                  <div>
                    <h3>Email Us</h3>
                    <p>info@example.com</p>
                  </div>
                </div>{/* End Info Item */}

              </div>

              <div className="col-lg-8">
                <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                  <div className="row gy-4">

                    <div className="col-md-6">
                      <input type="text" name="name" className="form-control" placeholder="Your Name" required=""></input>
                    </div>

                    <div className="col-md-6 ">
                      <input type="email" className="form-control" name="email" placeholder="Your Email" required=""></input>
                    </div>

                    <div className="col-md-12">
                      <input type="text" className="form-control" name="subject" placeholder="Subject" required=""></input>
                    </div>

                    <div className="col-md-12">
                      <textarea className="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
                    </div>

                    <div className="col-md-12 text-center">
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">Your message has been sent. Thank you!</div>

                      <button type="submit">Send Message</button>
                    </div>

                  </div>
                </form>
              </div>{/* End Contact Form */}

            </div>

          </div>

        </section>{/* /Contact Section */}

      </main>
  );
};

export default Main;