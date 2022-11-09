import type { PluginContext } from '@rcv-prod-toolkit/types'

module.exports = async (ctx: PluginContext) => {
  const namespace = ctx.plugin.module.getName()
  // Register new UI page
  ctx.LPTE.emit({
    meta: {
      type: 'add-pages',
      namespace: 'ui',
      version: 1
    },
    pages: [
      {
        name: 'LoL: Caster Cockpit',
        frontend: 'frontend',
        id: `op-${namespace}`
      }
    ]
  })

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  })
}
