document.addEventListener('DOMContentLoaded', function() {
    // Simple front-matter parser
    function parseFrontMatter(mdText) {
      const parts = mdText.split('---');
      if (parts.length < 3) return {};
      return parts[1]
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .reduce((data, line) => {
          const [rawKey, ...rawVal] = line.split(':');
          const key = rawKey.trim();
          let val = rawVal.join(':').trim();
          if ((val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          data[key] = val;
          return data;
        }, {});
    }
  
    const container = document.getElementById("course-container");
    if (!container) {
      console.error("❌ #course-container not found in the DOM");
      return;
    }
  
    // List your markdown files here:
    const courseFiles = [
      "courses/course-one.md",
      // "courses/another-course.md",
    ];
  
    courseFiles.forEach(file => {
      fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`${file} not found (${res.status})`);
          return res.text();
        })
        .then(md => {
          const course = parseFrontMatter(md);
          // sanity check
          if (!course.title || !course.video) {
            console.error(`❌ Missing title or video in front-matter of ${file}`);
            return;
          }
  
          const html = `
            <div class="col-md-6">
              <div class="card shadow-sm h-100">
                <iframe class="card-img-top"
                        height="250"
                        src="${course.video}"
                        title="${course.title}"
                        allowfullscreen>
                </iframe>
                <div class="card-body">
                  <h5 class="card-title">${course.title}</h5>
                  <p class="card-text">${course.description || ''}</p>
                  <div class="mb-3 text-muted">${course.price ? 'Price: ' + course.price : ''}</div>
                  ${course.trial ? `<a href="${course.trial}" class="btn btn-outline-primary me-2">Try Free</a>` : ''}
                  ${course.purchase ? `<a href="${course.purchase}" class="btn btn-primary">Buy Now</a>` : ''}
                </div>
              </div>
            </div>`;
          
          container.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error(`❌ Error loading ${file}:`, err));
    });
  });