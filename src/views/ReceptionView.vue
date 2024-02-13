<template>
  <h2 class="mb-3">前台</h2>
  <h5>
  <RouterLink to="/">首頁</RouterLink> |
  <RouterLink to="/reception">前台產品列</RouterLink> |
  <RouterLink to="/login">登入</RouterLink> |
  <RouterLink to="/product">後台產品列</RouterLink>
  </h5>
  <br>
  <h5>首頁</h5>
<div class="container">
          <div class="mt-4">
              <!-- 產品Modal -->
              <UserProductsModal ref="modal" :product="product" :add-product="addProduct"></UserProductsModal>
              <!-- 產品Modal -->

              <table class="table align-middle">
                  <thead>
                      <tr>
                          <th>圖片</th>
                          <th>商品名稱</th>
                          <th>價格</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in products" :key="item.id">
                          <td style="width: 200px">
                              <div style="height: 100px
                              /* 參考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-image */
                              background-size: cover; background-position: center"
                                  :style="{ backgroundImage: `url(${item.imageUrl})` }">
                              </div>
                          </td>
                          <td>
                              {{ item.title }}
                          </td>
                          <td>
                              <div calss="h5" v-if="!item.price">{{ item.origin_price }}</div>
                              <del class="h6">原價 {{ item.origin_price }} 元</del>
                              <div class="h5">現在只要 {{ item.price }} 元</div>
                          </td>
                          <td>
                              <div class="btn-group btn-group-sm">
                                  <button type="button" class="btn btn-outline-secondary" @click="getData(item.id)"
                                      :disabled="loadingState.isloading === item.id || !item.is_enabled">
                                      <i class="fas fa-spinner fa-pulse"
                                          v-if="loadingState.isloading === item.id"></i>
                                      查看更多
                                  </button>
                                  <button type="button" class="btn btn-outline-danger" @click="addProduct(item.id)"
                                      :disabled="loadingState.isloading === item.id || !item.is_enabled">
                                      <i class="fas fa-spinner fa-pulse"
                                          v-if="loadingState.isloading === item.id"></i>
                                      加到購物車
                                  </button>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <!-- 購物車列表 -->
                  <div class="text-end">
                      <button class="btn btn-outline-danger" type="button" @click="delItems">清空購物車</button>
                  </div>
                  <table class="table align-middle">
                      <thead>
                          <tr>
                              <th></th>
                              <th>品名</th>
                              <th style="width: 150px">數量/單位</th>
                              <th class="text-end">單價</th>
                          </tr>
                      </thead>
                      <tbody>
                          <template v-if="cart.carts">
                              <tr v-for="cart in cart.carts" :key="cart.id">
                                  <td>
                                      <button type="button" class="btn btn-outline-danger btn-sm"
                                          @click="delCart(cart.id)" :disabled="loadingState.isloading === cart.id">
                                          <i class="fas fa-spinner fa-pulse"
                                              v-if="loadingState.isloading === cart.id"></i>
                                          x
                                      </button>
                                  </td>
                                  <td>
                                      {{ cart.product.title }}
                                      <div class="text-success" v-if="cart.coupon">
                                          已套用優惠券
                                      </div>
                                  </td>
                                  <td>
                                      <div class="input-group input-group-sm">
                                          <div class="input-group mb-3">
                                              <input min="1" type="number" class="form-control" v-model.number="cart.qty"
                                                  @blur="updateStatus(cart)"
                                                  :disabled="loadingState.isloading === cart.id">
                                              <span class="input-group-text" id="basic-addon2">{{ cart.product.unit
                                                  }}</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td class="text-end">
                                      <small class="text-success" v-if="cart.final_total !== cart.total">折扣價：</small>
                                      {{ cart.final_total }}
                                  </td>
                              </tr>
                          </template>
                      </tbody>
                      <tfoot>
                          <tr>
                              <td colspan="3" class="text-end">總計</td>
                              <td class="text-end">{{ cart.total }}</td>
                          </tr>
                          <tr v-if="cart.final_total !== cart.total">
                              <td colspan="3" class="text-end text-success">折扣價</td>
                              <td class="text-end text-success">{{ cart.final_total }}</td>
                          </tr>
                      </tfoot>
                  </table>
              </div>

          <div class="my-5 row justify-content-center">
              <VForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="addOrder">
                  <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <VField id="email" name="email" type="email" class="form-control"
                          :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|required"
                          v-model="form.user.email"></VField>
                      <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
                  </div>

                  <div class="mb-3">
                      <label for="name" class="form-label">收件人姓名</label>
                      <VField id="name" name="姓名" type="text" class="form-control"
                          :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入姓名" rules="required"
                          v-model="form.user.name"></VField>
                      <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
                  </div>

                  <div class="mb-3">
                      <label for="tel" class="form-label">收件人電話</label>
                      <VField id="tel" name="電話" type="text" class="form-control"
                          :class="{ 'is-invalid': errors['電話'] }" placeholder="請輸入電話，ex:092345532"
                          rules="required|min:9|max:10" v-model="form.user.tel"></VField>
                      <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
                  </div>

                  <div class="mb-3">
                      <label for="address" class="form-label">收件人地址</label>
                      <VField id="address" name="地址" type="text" class="form-control"
                          :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址" rules="required"
                          v-model="form.user.address"></VField>
                      <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
                  </div>

                  <div class="mb-3">
                      <label for="message" class="form-label">留言</label>
                      <textarea id="message" class="form-control" cols="30" rows="10"
                          v-model="form.message"></textarea>
                  </div>
                  <div class="text-end">
                      <button type="submit" class="btn btn-danger">送出訂單</button>
                  </div>
              </VForm>
          </div>
      </div>
</template>

<script>
import axios from 'axios';
import UserProductsModal from '../components/UserProductsModal.vue';
const { VITE_URL, VITE_PATH } = import.meta.env;
export default {
  data () {
    return {
      loadingState: {
        isloading: ''
      },
      products: [],
      product: {},
      cart: {},
      qty: 1,
      userPtModal: null,
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    };
  },
  methods: {
    getDatas () {
      axios.get(`${VITE_URL}/api/${VITE_PATH}/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    getData (id) {
      this.loadingState.isloading = id;
      axios.get(`${VITE_URL}/api/${VITE_PATH}/product/${id}`)
        .then((response) => {
          this.loadingState.isloading = '';
          this.product = response.data.product;
          this.$refs.modal.openModal();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    getCart () {
      axios.get(`${VITE_URL}/api/${VITE_PATH}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    addProduct (id, qty = 1) {
      this.loadingState.isloading = id;
      const cart = {
        product_id: id,
        qty
      };

      axios.post(`${VITE_URL}/api/${VITE_PATH}/cart`, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingState.isloading = '';
          this.$refs.modal.closeModal();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    delCart (id) {
      this.loadingState.isloading = id;
      axios.delete(`${VITE_URL}/api/${VITE_PATH}/cart/${id}`)
        .then((res) => {
          this.loadingState.isloading = '';
          alert(res.data.message);
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    delItems () {
      axios.delete(`${VITE_URL}/api/${VITE_PATH}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    updateStatus (carts) {
      this.loadingState.isloading = carts.id;
      const cart = {
        product_id: carts.product_id,
        qty: carts.qty
      };
      axios.put(`${VITE_URL}/api/${VITE_PATH}/cart/${carts.id}`, { data: cart })
        .then((res) => {
          this.loadingState.isloading = '';
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    addOrder () {
      if (this.cart.carts.length === 0) {
        alert('你的購物車是空的，無法送出訂單');
      } else {
        const order = this.form;
        axios.post(`${VITE_URL}/api/${VITE_PATH}/order`, { data: order })
          .then((res) => {
            alert(res.data.message);
            this.$refs.form.resetForm();
            this.loadingState.isloading = '';
            this.getCart();
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      }
    }
  },
  mounted () {
    this.getDatas();
    this.getCart();
  },
  components: {
    UserProductsModal
  }
};
</script>

<style scoped>
</style>
