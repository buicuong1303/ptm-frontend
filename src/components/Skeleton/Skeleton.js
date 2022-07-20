/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Skeleton } from '@material-ui/lab';
import { useLocation } from 'react-router';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  topBar: {
    zIndex: 2,
    position: 'relative'
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  navBar: {
    zIndex: 3,
    width: 256,
    minWidth: 256,
    flex: '0 0 auto'
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto'
  },
  navBarSkeleton: {
    height: '100%',
    width: 256,
    backgroundColor: 'red'
  }
}));
const SkeletonComponent = (props) => {
  const location = useLocation();
  return (
    <div className="container" style={{ display: 'flex', height: '100%' }}>
      <div
        className="nav-left"
        style={{
          width: 256,
          height: '100%',
          backgroundColor: '#CFCFCF',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '0 10px', backgroundColor: '#c4c4c4' }}>
          <Skeleton
            animation="wave"
            style={{
              width: '100%',
              height: '70px',
              backgroundColor: '#eee'
            }}
          />
        </div>
        <div style={{ padding: '15px', margin: '40px 0px' }}>
          <Skeleton
            variant="text"
            animation="wave"
            width={100}
            height={20}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#f2f2f2'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
        </div>
        <div style={{ padding: '15px', margin: '40px 0px' }}>
          <Skeleton
            variant="text"
            animation="wave"
            width={100}
            height={20}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#f2f2f2'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
        </div>
        <div style={{ padding: '15px', margin: '40px 0px' }}>
          <Skeleton
            variant="text"
            animation="wave"
            width={100}
            height={20}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#f2f2f2'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            style={{
              transform: 'none',
              margin: '5px 0px',
              backgroundColor: '#eeee'
            }}
          />
        </div>
        <div
          style={{
            padding: '20px 10px',
            backgroundColor: '#c4c4c4',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Skeleton
            variant="circle"
            width={40}
            height={40}
            style={{ backgroundColor: '#eee' }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width={100}
            height={30}
            style={{ backgroundColor: '#eee', marginLeft: '20px' }}
          />
        </div>
      </div>
      <div
        className="wrapper-content"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <div
          className="top-header"
          style={{
            backgroundColor: '#CFCFCF',
            height: '64px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Skeleton
            variant="circle"
            width={40}
            height={40}
            style={{ backgroundColor: '#eee', margin: '0px 10px' }}
          />
        </div>
        {location.pathname.match(/^\/messages\/.+/g) && (
          <div
            className="content"
            style={{ flex: 1, margin: 16, display: 'flex' }}
          >
            <div
              className="conversation-list"
              style={{
                backgroundColor: '#cfcfcf',
                flex: 1,
                marginRight: '5px',
                padding: 5
              }}
            >
              <div style={{ display: 'flex' }}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={300}
                  height={40}
                  style={{
                    transform: 'none',
                    margin: '5px 0px',
                    backgroundColor: '#eeee'
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={40}
                  style={{
                    transform: 'none',
                    margin: '5px 0px 5px 5px',
                    backgroundColor: '#eeee',
                    flex: 1
                  }}
                />
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={300}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>

              <div
                className="conversation-item"
                style={{
                  height: 70,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={200}
                    height={10}
                    style={{
                      transform: 'none',
                      margin: '5px 0px',
                      backgroundColor: '#eeee'
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className="chat"
              style={{
                backgroundColor: '#cccc',
                flex: 3,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                className="tool-bar"
                style={{
                  backgroundColor: '#c4c4c4',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 16
                }}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  style={{ backgroundColor: '#eee', margin: '0px 10px' }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={10}
                  width={120}
                  style={{
                    transform: 'none',
                    margin: '0px 10px',
                    backgroundColor: '#eeee'
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={40}
                  style={{
                    transform: 'none',
                    backgroundColor: '#eeee',
                    flex: 1
                  }}
                />
              </div>
              <div
                className="message-list"
                style={{
                  backgroundColor: '#cfcfcf',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={150}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={100}
                      width={150}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={150}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={100}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={200}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={150}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'end', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={150}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'start', width: '100%' }}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={20}
                      width={250}
                      style={{
                        transform: 'none',
                        backgroundColor: '#eeee',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', marginTop: 'auto' }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={40}
                    style={{
                      transform: 'none',
                      backgroundColor: '#eeee',
                      flex: 1
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkeletonComponent;
