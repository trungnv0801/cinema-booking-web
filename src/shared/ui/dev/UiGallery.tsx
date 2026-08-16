import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import {
  Button,
  Checkbox,
  CountdownClock,
  DatePicker,
  DateStrip,
  FormField,
  IconButton,
  Input,
  MarqueeTicker,
  Modal,
  Pagination,
  RadioGroup,
  Select,
  Skeleton,
  StatusPill,
  Table,
  type TableColumn,
  Tabs,
  toast,
  Tooltip,
} from '@/shared/ui'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import styles from './UiGallery.module.scss'

interface DemoRow {
  id: string
  code: string
  status: string
  amount: number
}

const DEMO_ROWS: DemoRow[] = [
  { id: '1', code: 'BK-7K2X', status: 'PAID', amount: 182_000 },
  { id: '2', code: 'BK-8L3Y', status: 'PENDING', amount: 91_000 },
  { id: '3', code: 'BK-4N7Q', status: 'CANCELLED', amount: 65_000 },
]

const DEMO_COLUMNS: TableColumn<DemoRow>[] = [
  { id: 'code', header: 'Code', cell: (row) => row.code },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <StatusPill status={row.status}>{row.status}</StatusPill>,
  },
  { id: 'amount', header: 'Amount', numeric: true, cell: (row) => row.amount.toLocaleString() },
]

export function UiGallery() {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [checked, setChecked] = useState(true)
  const [radioValue, setRadioValue] = useState('standard')
  const [selectValue, setSelectValue] = useState('mb')
  const [date, setDate] = useState<Date | null>(null)
  const [stripDate, setStripDate] = useState(new Date())
  const [page, setPage] = useState(0)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Halcyon Cinemas — UI Gallery</h1>
        <LanguageSwitcher />
      </header>

      <Section title="Buttons">
        <div className={styles.row}>
          <Button variant="primary">{t('common:actions.save')}</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">{t('common:actions.cancel')}</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Icon buttons">
        <div className={styles.row}>
          <IconButton aria-label="Solid" variant="solid">
            ★
          </IconButton>
          <IconButton aria-label="Outline" variant="outline">
            ★
          </IconButton>
          <IconButton aria-label="Ghost" variant="ghost">
            ★
          </IconButton>
        </div>
      </Section>

      <Section title="Inputs">
        <div className={styles.row}>
          <Input placeholder="Standard input" />
          <Input placeholder="Invalid" invalid />
          <Select
            value={selectValue}
            onValueChange={setSelectValue}
            options={[
              { value: 'mb', label: 'Meridian Bay' },
              { value: 'bl', label: 'Brookline' },
              { value: 'ef', label: 'Eastford' },
            ]}
          />
        </div>
      </Section>

      <Section title="Checkbox & radio">
        <div className={styles.row}>
          <Checkbox
            label="Confirm age"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Checkbox label="Indeterminate" indeterminate />
          <RadioGroup
            name="ticket-type"
            value={radioValue}
            onValueChange={setRadioValue}
            orientation="horizontal"
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'student', label: 'Student' },
            ]}
          />
        </div>
      </Section>

      <Section title="Form field">
        <FormField label="Email" htmlFor="demo-email" required hint="We'll send your ticket here">
          <Input id="demo-email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Promo code" htmlFor="demo-promo" error="This code is invalid or expired">
          <Input id="demo-promo" invalid />
        </FormField>
      </Section>

      <Section title="Status pills">
        <div className={styles.row}>
          <StatusPill tone="success">Paid</StatusPill>
          <StatusPill tone="warning">Pending</StatusPill>
          <StatusPill tone="error">Cancelled</StatusPill>
          <StatusPill tone="neutral">Archived</StatusPill>
          <StatusPill tone="accent">Now Showing</StatusPill>
        </div>
      </Section>

      <Section title="Countdown clock">
        <div className={styles.row}>
          <CountdownClock remainingSeconds={320} />
          <CountdownClock remainingSeconds={45} />
        </div>
      </Section>

      <Section title="Date picker">
        <DatePicker value={date} onChange={setDate} />
      </Section>

      <Section title="Date strip">
        <DateStrip value={stripDate} onChange={setStripDate} />
        <DateStrip value={stripDate} onChange={setStripDate} days={7} />
      </Section>

      <Section title="Tabs">
        <Tabs
          items={[
            { value: 'now', label: 'Now Showing', content: <p>Now showing content</p> },
            { value: 'soon', label: 'Coming Soon', content: <p>Coming soon content</p> },
          ]}
        />
      </Section>

      <Section title="Skeletons">
        <div className={styles.row}>
          <Skeleton variant="text" width={120} />
          <Skeleton variant="rect" width={80} height={80} />
          <Skeleton variant="circle" width={48} height={48} />
        </div>
      </Section>

      <Section title="Tooltip">
        <Tooltip content="130,000 ₫ · VIP Seat">
          <Button variant="outline">Hover me</Button>
        </Tooltip>
      </Section>

      <Section title="Modal & Drawer">
        <div className={styles.row}>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ title: 'Seat D5 was just booked by someone else.', variant: 'error' })
            }
          >
            Trigger toast
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Cancel this ticket?"
          description="This can't be undone."
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Keep my ticket
              </Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>
                Confirm cancellation
              </Button>
            </>
          }
        >
          <p>Refund details would go here.</p>
        </Modal>
      </Section>

      <Section title="Marquee ticker">
        <MarqueeTicker
          items={['Paper Lanterns', 'Last Reel', 'The Long Monsoon', 'Static Hearts']}
        />
      </Section>

      <Section title="Table (density toggle + selection + states)">
        <div className={styles.row}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))}
          >
            Density: {density}
          </Button>
        </div>
        <Table
          columns={DEMO_COLUMNS}
          rows={DEMO_ROWS}
          rowKey={(row) => row.id}
          density={density}
          selectable
          selectedKeys={selectedKeys}
          onSelectedKeysChange={setSelectedKeys}
          bulkActions={<Button size="sm">Archive</Button>}
        />
        <Table columns={DEMO_COLUMNS} rows={[]} rowKey={(row) => row.id} loading skeletonRows={2} />
        <Table columns={DEMO_COLUMNS} rows={[]} rowKey={(row) => row.id} />
        <Table
          columns={DEMO_COLUMNS}
          rows={[]}
          rowKey={(row) => row.id}
          error="Couldn't load data."
          onRetry={() => undefined}
        />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}
