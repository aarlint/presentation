import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Grid, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import type { PresentationComponent } from '../../services/presentationService';

interface ChartData {
  type: string;
  labels: string[];
  data: Array<{ name: string; [key: string]: any }>;
  colors?: string[];
}

export const renderComponent = (component: PresentationComponent) => {
  const style = component.style || {};
  const renderTitleAndDescription = () => {
    if (!component.title && !component.description) return null;
    return (
      <Box sx={{ mb: 2 }}>
        {component.title && (
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {component.title}
          </Typography>
        )}
        {component.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {component.description}
          </Typography>
        )}
      </Box>
    );
  };

  switch (component.type) {
    case 'text':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              ...style
            }}
          >
            {component.content.text}
          </Typography>
        </Box>
      );

    case 'image':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2 }}>
            <Box
              component="img"
              src={component.content.imageUrl}
              alt="Presentation image"
              sx={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                mb: 1,
                ...style
              }}
            />
            {component.content.imageCaption && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center' }}
              >
                {component.content.imageCaption}
              </Typography>
            )}
          </Box>
        </Box>
      );

    case 'table':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ overflowX: 'auto', mb: 2, ...style }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {component.content.tableData?.map((row: any[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const { position, ...cellStyle } = style;
                      return (
                        <td
                          key={cellIndex}
                          style={{
                            border: '1px solid',
                            padding: '8px',
                            textAlign: 'left',
                            ...cellStyle
                          }}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      );

    case 'chart':
      const renderChart = () => {
        const { type, labels, values } = component.content.chartData || {};
        
        if (!type || !labels || !values) {
          return (
            <Typography variant="body2" color="text.secondary">
              Invalid chart data
            </Typography>
          );
        }

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
        const data = labels.map((label, index) => ({
          name: label,
          value: values[index]
        }));

        switch (type.toLowerCase()) {
          case 'line':
            return (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS[0]}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            );

          case 'bar':
            return (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill={COLORS[0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            );

          case 'pie':
            return (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            );

          default:
            return (
              <Typography variant="body2" color="text.secondary">
                Unsupported chart type: {type}
              </Typography>
            );
        }
      };

      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {renderTitleAndDescription()}
          <Box 
            sx={{ 
              flex: 1,
              width: '100%',
              mb: 2, 
              p: 2,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              borderRadius: 1,
              ...style 
            }}
          >
            {renderChart()}
          </Box>
        </Box>
      );

    case 'list':
      return (
        <Box>
          {renderTitleAndDescription()}
          <List sx={{ mb: 2, ...style }}>
            {component.content.listItems?.map((item: string, index: number) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {component.content.listType === 'check' ? (
                    <CheckCircleIcon color="primary" />
                  ) : component.content.listType === 'numbered' ? (
                    <RadioButtonCheckedIcon color="primary" />
                  ) : (
                    <FiberManualRecordIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item}
                  sx={{ ...style }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      );

    case 'quote':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, pl: 2, borderLeft: '4px solid', borderColor: 'primary.main', ...style }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontStyle: 'italic',
                ...style
              }}
            >
              "{component.content.quoteText}"
            </Typography>
            {component.content.quoteAuthor && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'right' }}
              >
                - {component.content.quoteAuthor}
              </Typography>
            )}
          </Box>
        </Box>
      );

    case 'code':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box 
            sx={{ 
              mb: 2,
              p: 2,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              ...style
            }}
          >
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mb: 1,
                opacity: (theme) => theme.palette.mode === 'dark' ? 0.7 : 1
              }}
            >
              {component.content.codeLanguage || 'code'}
            </Typography>
            <Typography 
              component="pre" 
              variant="body2"
              sx={{ 
                margin: 0,
                whiteSpace: 'pre-wrap',
                color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
                ...style
              }}
            >
              {component.content.code}
            </Typography>
          </Box>
        </Box>
      );

    case 'video':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, textAlign: 'center', ...style }}>
            <PlayCircleOutlineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1">
              {component.content.videoType?.toUpperCase()} Video
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {component.content.videoUrl}
            </Typography>
          </Box>
        </Box>
      );

    case 'shape':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, textAlign: 'center', ...style }}>
            {component.content.shape === 'arrow' ? (
              <ArrowForwardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            ) : component.content.shape === 'star' ? (
              <StarIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            ) : (
              <Typography variant="body1">
                Shape: {component.content.shape}
              </Typography>
            )}
          </Box>
        </Box>
      );

    case 'icon':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, textAlign: 'center', ...style }}>
            <Typography variant="body1">
              Icon: {component.content.icon}
            </Typography>
          </Box>
        </Box>
      );

    case 'timeline':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, ...style }}>
            <TimelineIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
            {component.content.timelineEvents?.map((event: any, index: number) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" color="primary">
                  {event.date}
                </Typography>
                <Typography variant="body1">
                  {event.event}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );

    case 'process':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, ...style }}>
            {component.content.processSteps?.map((step: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Step {index + 1}: {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );

    case 'comparison':
      return (
        <Box>
          {renderTitleAndDescription()}
          <Box sx={{ mb: 2, ...style }}>
            <CompareArrowsIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
            <Grid container spacing={2}>
              {component.content.comparisonItems?.map((item: any, index: number) => (
                <Grid item xs={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <List>
                      {item.features.map((feature: string, featureIndex: number) => (
                        <ListItem key={featureIndex}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      );

    default:
      return null;
  }
}; 