'use client';

const fallback = (value, text) => (value && String(value).trim() ? value : text);

export default function Template1Preview({ data = {}, previewMode = false }) {
  const name = fallback(data.name, 'Your Name');
  const jobTitle = fallback(data.job_title, 'Professional Title');
  const phone = fallback(data.phone, 'Phone Number');
  const email = fallback(data.email, 'Email Address');
  const linkedin = fallback(data.linkedin, 'LinkedIn');
  const linkedinUrl = data.linkedin_url || '#';
  const summary = data.summary || '';
  const skillsCategories = Array.isArray(data.skills_categories) ? data.skills_categories : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return (
    <>
      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 10pt;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        body {
          font-family: 'Calibri', 'Nunito Sans', 'Segoe UI', 'Gill Sans MT', 'Gill Sans',
            Optima, Candara, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #000;
          background: #fff;
        }

        .resume-wrapper {
          width: 100%;
          max-width: ${previewMode ? 'none' : '760px'};
          margin: 0 auto;
          padding: ${previewMode ? '26px 30px' : '26px 30px'};
          background: #fff;
        }

        .resume-header {
          text-align: center;
          padding-bottom: 9px;
          border-bottom: 1.8px solid #000;
          margin-bottom: 9px;
        }

        .resume-header h1 {
          font-family: 'Calibri', 'Nunito Sans', 'Segoe UI', sans-serif;
          font-size: 20.5pt;
          font-weight: 700;
          letter-spacing: 0.045em;
          text-transform: uppercase;
          line-height: 1.15;
          margin-bottom: 2px;
        }

        .resume-header .job-title {
          font-size: 10.5pt;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .contact-line {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          font-size: 9pt;
        }

        .contact-line .c-sep {
          margin: 0 6px;
          color: #555;
        }

        .contact-line a {
          color: #000;
          text-decoration: none;
        }

        .section-title {
          font-size: 10pt;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding-bottom: 2px;
          border-bottom: 1.4px solid #000;
          margin-top: 10px;
          margin-bottom: 6px;
        }

        .summary-text {
          font-size: 10pt;
          line-height: 1.45;
        }

        .skills-table {
          width: 100%;
          border-collapse: collapse;
        }

        .skills-table td {
          padding: 1.5px 0;
          font-size: 10pt;
          line-height: 1.4;
          vertical-align: top;
        }

        .skills-category-label {
          font-weight: 700;
          white-space: nowrap;
          padding-right: 8px;
          min-width: 168px;
        }

        .entry {
          margin-bottom: 8px;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 2px;
        }

        .entry-org {
          font-weight: 700;
          font-size: 10pt;
        }

        .entry-dates {
          font-size: 9.5pt;
          font-style: italic;
          white-space: nowrap;
        }

        .entry-sub {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }

        .entry-role {
          font-size: 10pt;
          font-style: italic;
        }

        .entry-meta {
          font-size: 9pt;
          color: #333;
        }

        .entry-bullets,
        .cert-list,
        .achieve-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .entry-bullets li,
        .achieve-list li {
          position: relative;
          padding-left: 11px;
          font-size: 10pt;
          line-height: 1.45;
          margin-bottom: 1.5px;
        }

        .entry-bullets li::before {
          content: '–';
          position: absolute;
          left: 0;
        }

        .cert-list li {
          position: relative;
          padding-left: 13px;
          font-size: 10pt;
          line-height: 1.5;
          margin-bottom: 2px;
        }

        .cert-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          font-size: 10pt;
          line-height: 1.5;
        }

        .cert-list li strong {
          font-weight: 700;
        }

        .edu-entry {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 2px;
          margin-bottom: 5px;
        }

        .edu-left .edu-degree {
          font-weight: 700;
          font-size: 10pt;
        }

        .edu-left .edu-institution {
          font-size: 10pt;
        }

        .edu-right {
          text-align: right;
        }

        .edu-right .edu-dates,
        .edu-right .edu-score {
          font-size: 9.5pt;
        }

        @media screen and (max-width: 600px) {
          .resume-wrapper {
            padding: 14px 12px;
          }

          .entry-header,
          .entry-sub,
          .edu-entry {
            flex-direction: column;
          }

          .entry-dates,
          .entry-meta,
          .edu-right {
            text-align: left;
            font-style: normal;
          }

          .contact-line {
            flex-direction: column;
            align-items: center;
          }

          .contact-line .c-sep {
            display: none;
          }

          .skills-table td {
            display: block;
            width: 100%;
          }

          .skills-category-label {
            padding-right: 0;
            padding-bottom: 1px;
          }
        }
      `}</style>

      <div className="resume-wrapper">
        <header className="resume-header">
          <h1>{name}</h1>
          <p className="job-title">{jobTitle}</p>
          <div className="contact-line">
            <span>{phone}</span>
            <span className="c-sep">♦</span>
            <span>
              <a href={`mailto:${email}`}>{email}</a>
            </span>
            <span className="c-sep">♦</span>
            <span>
              <a href={linkedinUrl} target="_blank" rel="noreferrer">
                {linkedin}
              </a>
            </span>
          </div>
        </header>

        {summary ? (
          <section aria-label="Summary">
            <h2 className="section-title">Summary</h2>
            <p className="summary-text">{summary}</p>
          </section>
        ) : null}

        {skillsCategories.length ? (
          <section aria-label="Skills">
            <h2 className="section-title">Skills</h2>
            <table className="skills-table" role="presentation">
              <tbody>
                {skillsCategories.map((skill) => (
                  <tr key={skill.category_label}>
                    <td className="skills-category-label">{skill.category_label}:</td>
                    <td>{skill.skills_list}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {experience.length ? (
          <section aria-label="Experience">
            <h2 className="section-title">Experience</h2>
            {experience.map((item, index) => (
              <div className="entry" key={`${item.company}-${index}`}>
                <div className="entry-header">
                  <span className="entry-org">{item.company}</span>
                  <span className="entry-dates">
                    {item.start_date} – {item.end_date}
                  </span>
                </div>
                <div className="entry-sub">
                  <span className="entry-role">{item.role}</span>
                </div>
                {item.bullets?.length ? (
                  <ul className="entry-bullets">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {projects.length ? (
          <section aria-label="Projects">
            <h2 className="section-title">Projects</h2>
            {projects.map((item, index) => (
              <div className="entry" key={`${item.project_name}-${index}`}>
                <div className="entry-header">
                  <span className="entry-org">
                    {item.project_name}{' '}
                    {item.technologies ? (
                      <span style={{ fontWeight: 400 }}>| {item.technologies}</span>
                    ) : null}
                  </span>
                </div>
                {item.bullets?.length ? (
                  <ul className="entry-bullets">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {certifications.length ? (
          <section aria-label="Awards and Certifications">
            <h2 className="section-title">Awards &amp; Certifications</h2>
            <ul className="cert-list">
              {certifications.map((item, index) => (
                <li key={`${item.cert_title}-${index}`}>
                  <strong>{item.cert_title}</strong>
                  {item.issuer ? ` – ${item.issuer}` : ''}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {education.length ? (
          <section aria-label="Education">
            <h2 className="section-title">Education</h2>
            {education.map((item, index) => (
              <div className="edu-entry" key={`${item.degree}-${index}`}>
                <div className="edu-left">
                  <p className="edu-degree">{item.degree}</p>
                  <p className="edu-institution">{item.institution}</p>
                </div>
                <div className="edu-right">
                  <p className="edu-dates">{item.graduation_date}</p>
                  {item.score ? <p className="edu-score">{item.score}</p> : null}
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </>
  );
}
