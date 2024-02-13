<template>
    <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item"
      :class="{ disabled: !pages.has_pre }">
        <a class="page-link" aria-label="Previous"
        @click.prevent="getData(pages.current_page -1 )">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item"
      :class="{
        active: page === pages.current_page
      }"
      v-for="page in pages.total_pages" :key="page + 123">
        <a class="page-link"
        @click.prevent="getData(page)"
        >{{ page }}</a>
      </li>

      <li class="page-item"
      :class="{ disabled: !pages.has_next }">
        <a class="page-link" aria-label="Next"
        @click.prevent="getData(pages.current_page +1 )">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import 'bootstrap/scss/bootstrap.scss';
export default {
  props: ['pages', 'getData']
};
</script>
