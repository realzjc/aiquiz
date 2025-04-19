"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
// const chartData = [
//     { date: "2024-04-01", desktop: 222, mobile: 150 },
//     { date: "2024-04-02", desktop: 97, mobile: 180 },
//     { date: "2024-04-03", desktop: 167, mobile: 120 },
//     { date: "2024-04-04", desktop: 242, mobile: 260 },
//     { date: "2024-04-05", desktop: 373, mobile: 290 },
//     { date: "2024-04-06", desktop: 301, mobile: 340 },
//     { date: "2024-04-07", desktop: 245, mobile: 180 },
//     { date: "2024-04-08", desktop: 409, mobile: 320 },
//     { date: "2024-04-09", desktop: 59, mobile: 110 },
//     { date: "2024-04-10", desktop: 261, mobile: 190 },
//     { date: "2024-04-11", desktop: 327, mobile: 350 },
//     { date: "2024-04-12", desktop: 292, mobile: 210 },
//     { date: "2024-04-13", desktop: 342, mobile: 380 },
//     { date: "2024-04-14", desktop: 137, mobile: 220 },
//     { date: "2024-04-15", desktop: 120, mobile: 170 },
//     { date: "2024-04-16", desktop: 138, mobile: 190 },
//     { date: "2024-04-17", desktop: 446, mobile: 360 },
//     { date: "2024-04-18", desktop: 364, mobile: 410 },
//     { date: "2024-04-19", desktop: 243, mobile: 180 },
//     { date: "2024-04-20", desktop: 89, mobile: 150 },
//     { date: "2024-04-21", desktop: 137, mobile: 200 },
//     { date: "2024-04-22", desktop: 224, mobile: 170 },
//     { date: "2024-04-23", desktop: 138, mobile: 230 },
//     { date: "2024-04-24", desktop: 387, mobile: 290 },
//     { date: "2024-04-25", desktop: 215, mobile: 250 },
//     { date: "2024-04-26", desktop: 75, mobile: 130 },
//     { date: "2024-04-27", desktop: 383, mobile: 420 },
//     { date: "2024-04-28", desktop: 122, mobile: 180 },
//     { date: "2024-04-29", desktop: 315, mobile: 240 },
//     { date: "2024-04-30", desktop: 454, mobile: 380 },
//     { date: "2024-05-01", desktop: 165, mobile: 220 },
//     { date: "2024-05-02", desktop: 293, mobile: 310 },
//     { date: "2024-05-03", desktop: 247, mobile: 190 },
//     { date: "2024-05-04", desktop: 385, mobile: 420 },
//     { date: "2024-05-05", desktop: 481, mobile: 390 },
//     { date: "2024-05-06", desktop: 498, mobile: 520 },
//     { date: "2024-05-07", desktop: 388, mobile: 300 },
//     { date: "2024-05-08", desktop: 149, mobile: 210 },
//     { date: "2024-05-09", desktop: 227, mobile: 180 },
//     { date: "2024-05-10", desktop: 293, mobile: 330 },
//     { date: "2024-05-11", desktop: 335, mobile: 270 },
//     { date: "2024-05-12", desktop: 197, mobile: 240 },
//     { date: "2024-05-13", desktop: 197, mobile: 160 },
//     { date: "2024-05-14", desktop: 448, mobile: 490 },
//     { date: "2024-05-15", desktop: 473, mobile: 380 },
//     { date: "2024-05-16", desktop: 338, mobile: 400 },
//     { date: "2024-05-17", desktop: 499, mobile: 420 },
//     { date: "2024-05-18", desktop: 315, mobile: 350 },
//     { date: "2024-05-19", desktop: 235, mobile: 180 },
//     { date: "2024-05-20", desktop: 177, mobile: 230 },
//     { date: "2024-05-21", desktop: 82, mobile: 140 },
//     { date: "2024-05-22", desktop: 81, mobile: 120 },
//     { date: "2024-05-23", desktop: 252, mobile: 290 },
//     { date: "2024-05-24", desktop: 294, mobile: 220 },
//     { date: "2024-05-25", desktop: 201, mobile: 250 },
//     { date: "2024-05-26", desktop: 213, mobile: 170 },
//     { date: "2024-05-27", desktop: 420, mobile: 460 },
//     { date: "2024-05-28", desktop: 233, mobile: 190 },
//     { date: "2024-05-29", desktop: 78, mobile: 130 },
//     { date: "2024-05-30", desktop: 340, mobile: 280 },
//     { date: "2024-05-31", desktop: 178, mobile: 230 },
//     { date: "2024-06-01", desktop: 178, mobile: 200 },
//     { date: "2024-06-02", desktop: 470, mobile: 410 },
//     { date: "2024-06-03", desktop: 103, mobile: 160 },
//     { date: "2024-06-04", desktop: 439, mobile: 380 },
//     { date: "2024-06-05", desktop: 88, mobile: 140 },
//     { date: "2024-06-06", desktop: 294, mobile: 250 },
//     { date: "2024-06-07", desktop: 323, mobile: 370 },
//     { date: "2024-06-08", desktop: 385, mobile: 320 },
//     { date: "2024-06-09", desktop: 438, mobile: 480 },
//     { date: "2024-06-10", desktop: 155, mobile: 200 },
//     { date: "2024-06-11", desktop: 92, mobile: 150 },
//     { date: "2024-06-12", desktop: 492, mobile: 420 },
//     { date: "2024-06-13", desktop: 81, mobile: 130 },
//     { date: "2024-06-14", desktop: 426, mobile: 380 },
//     { date: "2024-06-15", desktop: 307, mobile: 350 },
//     { date: "2024-06-16", desktop: 371, mobile: 310 },
//     { date: "2024-06-17", desktop: 475, mobile: 520 },
//     { date: "2024-06-18", desktop: 107, mobile: 170 },
//     { date: "2024-06-19", desktop: 341, mobile: 290 },
//     { date: "2024-06-20", desktop: 408, mobile: 450 },
//     { date: "2024-06-21", desktop: 169, mobile: 210 },
//     { date: "2024-06-22", desktop: 317, mobile: 270 },
//     { date: "2024-06-23", desktop: 480, mobile: 530 },
//     { date: "2024-06-24", desktop: 132, mobile: 180 },
//     { date: "2024-06-25", desktop: 141, mobile: 190 },
//     { date: "2024-06-26", desktop: 434, mobile: 380 },
//     { date: "2024-06-27", desktop: 448, mobile: 490 },
//     { date: "2024-06-28", desktop: 149, mobile: 200 },
//     { date: "2024-06-29", desktop: 103, mobile: 160 },
//     { date: "2024-06-30", desktop: 446, mobile: 400 },
// ]

const chartData = [
    { date: "2024-04-01", practiced: 222, created: 150 },
    { date: "2024-04-02", practiced: 97, created: 180 },
    { date: "2024-04-03", practiced: 167, created: 120 },
    { date: "2024-04-04", practiced: 242, created: 260 },
    { date: "2024-04-05", practiced: 373, created: 290 },
    { date: "2024-04-06", practiced: 301, created: 340 },
    { date: "2024-04-07", practiced: 245, created: 180 },
    { date: "2024-04-08", practiced: 409, created: 320 },
    { date: "2024-04-09", practiced: 59, created: 110 },
    { date: "2024-04-10", practiced: 261, created: 190 },
    { date: "2024-04-11", practiced: 327, created: 350 },
    { date: "2024-04-12", practiced: 292, created: 210 },
    { date: "2024-04-13", practiced: 342, created: 380 },
    { date: "2024-04-14", practiced: 137, created: 220 },
    { date: "2024-04-15", practiced: 120, created: 170 },
    { date: "2024-04-16", practiced: 138, created: 190 },
    { date: "2024-04-17", practiced: 446, created: 360 },
    { date: "2024-04-18", practiced: 364, created: 410 },
    { date: "2024-04-19", practiced: 243, created: 180 },
    { date: "2024-04-20", practiced: 89, created: 150 },
    { date: "2024-04-21", practiced: 137, created: 200 },
    { date: "2024-04-22", practiced: 224, created: 170 },
    { date: "2024-04-23", practiced: 138, created: 230 },
    { date: "2024-04-24", practiced: 387, created: 290 },
    { date: "2024-04-25", practiced: 215, created: 250 },
    { date: "2024-04-26", practiced: 75, created: 130 },
    { date: "2024-04-27", practiced: 383, created: 420 },
    { date: "2024-04-28", practiced: 122, created: 180 },
    { date: "2024-04-29", practiced: 315, created: 240 },
    { date: "2024-04-30", practiced: 454, created: 380 },
    { date: "2024-05-01", practiced: 165, created: 220 },
    { date: "2024-05-02", practiced: 293, created: 310 },
    { date: "2024-05-03", practiced: 247, created: 190 },
    { date: "2024-05-04", practiced: 385, created: 420 },
    { date: "2024-05-05", practiced: 481, created: 390 },
    { date: "2024-05-06", practiced: 498, created: 520 },
    { date: "2024-05-07", practiced: 388, created: 300 },
    { date: "2024-05-08", practiced: 149, created: 210 },
    { date: "2024-05-09", practiced: 227, created: 180 },
    { date: "2024-05-10", practiced: 293, created: 330 },
    { date: "2024-05-11", practiced: 335, created: 270 },
    { date: "2024-05-12", practiced: 197, created: 240 },
    { date: "2024-05-13", practiced: 197, created: 160 },
    { date: "2024-05-14", practiced: 448, created: 490 },
    { date: "2024-05-15", practiced: 473, created: 380 },
    { date: "2024-05-16", practiced: 338, created: 400 },
    { date: "2024-05-17", practiced: 499, created: 420 },
    { date: "2024-05-18", practiced: 315, created: 350 },
    { date: "2024-05-19", practiced: 235, created: 180 },
    { date: "2024-05-20", practiced: 177, created: 230 },
    { date: "2024-05-21", practiced: 82, created: 140 },
    { date: "2024-05-22", practiced: 81, created: 120 },
    { date: "2024-05-23", practiced: 252, created: 290 },
    { date: "2024-05-24", practiced: 294, created: 220 },
    { date: "2024-05-25", practiced: 201, created: 250 },
    { date: "2024-05-26", practiced: 213, created: 170 },
    { date: "2024-05-27", practiced: 420, created: 460 },
    { date: "2024-05-28", practiced: 233, created: 190 },
    { date: "2024-05-29", practiced: 78, created: 130 },
    { date: "2024-05-30", practiced: 340, created: 280 },
    { date: "2024-05-31", practiced: 178, created: 230 },
    { date: "2024-06-01", practiced: 178, created: 200 },
    { date: "2024-06-02", practiced: 470, created: 410 },
    { date: "2024-06-03", practiced: 103, created: 160 },
    { date: "2024-06-04", practiced: 439, created: 380 },
    { date: "2024-06-05", practiced: 88, created: 140 },
    { date: "2024-06-06", practiced: 294, created: 250 },
    { date: "2024-06-07", practiced: 323, created: 370 },
    { date: "2024-06-08", practiced: 385, created: 320 },
    { date: "2024-06-09", practiced: 438, created: 480 },
    { date: "2024-06-10", practiced: 155, created: 200 },
    { date: "2024-06-11", practiced: 92, created: 150 },
    { date: "2024-06-12", practiced: 492, created: 420 },
    { date: "2024-06-13", practiced: 81, created: 130 },
    { date: "2024-06-14", practiced: 426, created: 380 },
    { date: "2024-06-15", practiced: 307, created: 350 },
    { date: "2024-06-16", practiced: 371, created: 310 },
    { date: "2024-06-17", practiced: 475, created: 520 },
    { date: "2024-06-18", practiced: 107, created: 170 },
    { date: "2024-06-19", practiced: 341, created: 290 },
    { date: "2024-06-20", practiced: 408, created: 450 },
    { date: "2024-06-21", practiced: 169, created: 210 },
    { date: "2024-06-22", practiced: 317, created: 270 },
    { date: "2024-06-23", practiced: 480, created: 530 },
    { date: "2024-06-24", practiced: 132, created: 180 },
    { date: "2024-06-25", practiced: 141, created: 190 },
    { date: "2024-06-26", practiced: 434, created: 380 },
    { date: "2024-06-27", practiced: 448, created: 490 },
    { date: "2024-06-28", practiced: 149, created: 200 },
    { date: "2024-06-29", practiced: 103, created: 160 },
    { date: "2024-06-30", practiced: 446, created: 400 },
];


// const chartConfig = {
//     visitors: {
//         label: "Visitors",
//     },
//     desktop: {
//         label: "Desktop",
//         color: "hsl(var(--chart-1))",
//     },
//     mobile: {
//         label: "Mobile",
//         color: "hsl(var(--chart-2))",
//     },
// } satisfies ChartConfig

const chartConfig = {
    practice: {
        label: "Quiz",
    },
    practiced: {
        label: "Practiced",
        color: "hsl(var(--chart-1))",
    },
    created: {
        label: "Created",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;


export function ChartAreaInteractive() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("30d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardTitle>Quiz Analytics</CardTitle>
                <CardDescription>
                    <span className="@[540px]/card:block hidden">
                        Total for the last 3 months
                    </span>
                    <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <div className="absolute right-4 top-4">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="@[767px]/card:flex hidden"
                    >
                        <ToggleGroupItem value="90d" className="h-8 px-2.5">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d" className="h-8 px-2.5">
                            Last 30 days
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d" className="h-8 px-2.5">
                            Last 7 days
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="@[767px]/card:hidden flex w-40"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {/* <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        /> */}
                        <Area
                            dataKey="practiced"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="created"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
