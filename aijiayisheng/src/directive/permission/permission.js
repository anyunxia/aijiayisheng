
// import store from '@/store'
// export default{
//   inserted(el, binding, vnode) {
//     const { value } = binding
//     const btnRoles = store.state.permission && store.state.permission.btnPer
//     if (value && value instanceof Array && value.length > 0) {
//        const permissionRoles = value
//        console.log(permissionRoles, 'wwwwwwwwwwwwwwwwwwww')
//       const hasPermission = btnRoles.some(role => {
//         return permissionRoles.includes(role)
//       })
//       console.log(el)
//       if (!hasPermission) {
          
//         el.parentNode && el.parentNode.removeChild(el)
//       }
//     } else {
//       throw new Error(`need btnRoles! Like v-permission="['coupons/add','coupons/editor']"`)
//     }
//   }
// }



import store from '@/store'
export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    var setBtnPer = localStorage.getItem("setBtnPer")
    const btnRoles = setBtnPer && setBtnPer.split(',')
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      // console.log(permissionRoles,'aaaaaaaaaaaaaaaaaaaaaaaa')
      const hasPermission = btnRoles.some(role => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need btnRoles! Like v-permission="['coupons/add','coupons/editor']"`)
    }
  }
}
