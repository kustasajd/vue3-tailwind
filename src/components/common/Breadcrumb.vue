<template>
  <nav v-if="linkItems" class="wrapper breadcrumbs">
    <ul class="breadcrumbs__wrap">
      <li class="breadcrumbs__item" v-for="item of linkItems" :key="item.index">
        <router-link
          :to="{
            name: item.name,
            params: item.params,
          }"
          class="link"
          >{{ item.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ["linkItems"],
};
</script>

<style lang="scss">
.breadcrumbs {
  &.wrapper {
    padding-top: 0;
  }
  &__wrap {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
  }
  &__item {
    display: flex;
    align-items: center;
    font-size: 16px;
    &:after {
      content: ">";
      margin: 0 5px;
      color: #5a67d8;
      opacity: 0.7;
    }
    .link {
      color: #5a67d8;
      font-weight: 500;
      white-space: nowrap;
      &:after {
        content: "";
        display: block;
        width: 0;
        height: 1px;
        margin-top: 2px;
        background: #5a67d8;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      &:hover {
        color: #5a67d8;
        &:after {
          width: 100%;
        }
      }
    }
    &:last-child {
      &:after {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 1020px) {
  .breadcrumbs {
    &__item {
      font-size: 12px;
    }
  }
}
</style>