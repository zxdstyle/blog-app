import eventBus from "@/util/event-bus"


function unifyErrorInterceptor(error) {
  eventBus.$emit("api-error", error)
  throw error
}

export default unifyErrorInterceptor
