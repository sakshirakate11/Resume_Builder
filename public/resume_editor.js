// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the resume form
    const resumeForm = document.getElementById('resume-form');
    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting or reloading the page

        // Retrieve input values from the form
        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const profile = document.getElementById('profile').value.trim();
        const skills = document.getElementById('skills').value.split(','); // Split skills into an array
        const workHistory = document.getElementById('work-history').value.trim();
        const education = document.getElementById('education').value.trim();

        // Update the preview section with user input

        // Update Name
        document.getElementById('preview-name').textContent = name || '[Your Name]';

        // Update Contact Information
        document.getElementById('preview-contact').textContent = contact || 'Contact Information';

        // Update Professional Profile
        document.getElementById('preview-profile').textContent = profile || 'A short professional summary will appear here.';

        // Update Skills
        const skillsList = document.getElementById('preview-skills');
        skillsList.innerHTML = ''; // Clear any previous skills
        skills.forEach(skill => {
            if (skill.trim()) { // Add only non-empty skills
                const li = document.createElement('li');
                li.textContent = skill.trim();
                skillsList.appendChild(li);
            }
        });

        // Update Work History
        document.getElementById('preview-work-history').textContent = workHistory || 'Job titles and descriptions will appear here.';

        // Update Education
        document.getElementById('preview-education').textContent = education || 'Education details will appear here.';
    });
});
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Existing form submission logic
    const resumeForm = document.getElementById('resume-form');
    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const profile = document.getElementById('profile').value.trim();
        const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
        const workHistory = document.getElementById('work-history').value.trim();
        const education = document.getElementById('education').value.trim();

        // Update the preview section
        document.getElementById('preview-name').textContent = name || '[Your Name]';
        document.getElementById('preview-contact').textContent = contact || 'Contact Information';
        document.getElementById('preview-profile').textContent = profile || 'A short professional summary will appear here.';
        const skillsList = document.getElementById('preview-skills');
        skillsList.innerHTML = '';
        skills.forEach(skill => {
            if (skill) {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            }
        });
        document.getElementById('preview-work-history').textContent = workHistory || 'Job titles and descriptions will appear here.';
        document.getElementById('preview-education').textContent = education || 'Education details will appear here.';
    });

    // Add event listener for the "Generate PDF & Download" button
    const downloadPdfButton = document.getElementById('download-pdf-btn');
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Collect content from the preview
        const name = document.getElementById('preview-name').textContent;
        const contact = document.getElementById('preview-contact').textContent;
        const profile = document.getElementById('preview-profile').textContent;
        const skills = Array.from(document.getElementById('preview-skills').children).map(li => li.textContent).join(', ');
        const workHistory = document.getElementById('preview-work-history').textContent;
        const education = document.getElementById('preview-education').textContent;

        // Add content to the PDF
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(name, 10, 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Contact: ${contact}`, 10, 20);
        doc.text(`Profile: ${profile}`, 10, 30);
        doc.text(`Skills: ${skills}`, 10, 40);
        doc.text(`Work History: ${workHistory}`, 10, 50);
        doc.text(`Education: ${education}`, 10, 60);

                // Download the PDF
                doc.save(`${name}-Resume.pdf`);

    });
});