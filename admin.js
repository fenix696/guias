// admin.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('video-form');
  const videoList = document.getElementById('video-list');
  const searchInput = document.getElementById('video-search');

  // 🔑 Configura la contraseña de administrador
  const ADMIN_PASSWORD = "admin123";

  let videos = JSON.parse(localStorage.getItem('videos')) || [];

  // Guardar videos en localStorage
  function saveVideos() {
    localStorage.setItem('videos', JSON.stringify(videos));
  }

  // Renderizar lista de videos
  function renderVideos(filter = '') {
    videoList.innerHTML = '';

    const filteredVideos = videos
      .map((video, index) => ({ ...video, originalIndex: index })) // Guardar índice real
      .filter(video => video.title.toLowerCase().includes(filter.toLowerCase()));

    if (filteredVideos.length === 0) {
      videoList.innerHTML = '<p>No hay videos disponibles.</p>';
      return;
    }

    filteredVideos.forEach(video => {
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('video-item');

      videoContainer.innerHTML = `
        <h3>${video.title}</h3>
        <iframe 
          src="https://www.youtube.com/embed/${video.id}" 
          allowfullscreen>
        </iframe>
        <br>
        <button class="delete-btn" data-index="${video.originalIndex}">
          🗑️ Eliminar
        </button>
      `;

      videoList.appendChild(videoContainer);
    });

    // Evento de eliminación
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', e => {
        const realIndex = e.target.getAttribute('data-index');
        deleteVideo(realIndex);
      });
    });
  }

  // Eliminar video individual
  function deleteVideo(index) {
    const enteredPassword = prompt("Ingrese la contraseña de administrador para eliminar este video:");

    if (enteredPassword !== ADMIN_PASSWORD) {
      alert("❌ Contraseña incorrecta. No se eliminó el video.");
      return;
    }

    videos.splice(index, 1); // Elimina solo ese índice real
    saveVideos();
    renderVideos(searchInput.value);
    alert("✅ Video eliminado correctamente.");
  }

  // Obtener ID del video de YouTube
  function getYouTubeId(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Agregar nuevo video
  form.addEventListener('submit', e => {
    e.preventDefault();

    const url = document.getElementById('video-url').value.trim();
    const title = document.getElementById('video-title').value.trim();

    const videoId = getYouTubeId(url);

    if (!videoId) {
      alert('❌ URL inválida de YouTube.');
      return;
    }

    videos.push({ id: videoId, title });
    saveVideos();
    renderVideos();
    form.reset();
  });

  // Buscar videos
  searchInput.addEventListener('input', e => {
    renderVideos(e.target.value);
  });

  // Render inicial
  renderVideos();
});
