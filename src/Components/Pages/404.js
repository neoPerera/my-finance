import React from "react";
function NotFound()
{
    return(
        <div>
            <section className="content">
                <div className="error-page">
                    <h2 className="headline text-warning"> 404</h2>

                    <div className="error-content">
                    <h3><i className="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

                    <p>
                        We could not find the page you were looking for.
                        Meanwhile, you may <a href="/">return to dashboard</a> or try using the search form.
                    </p>

                    
                    </div>
                    {/* <!-- /.error-content --> */}
                </div>
                {/* <!-- /.error-page --> */}
                </section>
        </div>
    );
}
export default NotFound; 