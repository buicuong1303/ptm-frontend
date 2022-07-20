/* eslint-disable prettier/prettier */
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { Cancel, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { CustomButton, DialogConfirm } from 'components';
import { CustomTextField } from 'components/CustomFields';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateRole } from 'scenes/Role/Role.asyncActions';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto'
  },
  button: {
    justifyContent: 'flex-end'
  },

  dialogContent: {
    // backgroundColor: theme.palette.error.main,
    padding: theme.spacing(5),
    flexWrap: 'wrap'
  },
  list: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    position: 'relative',
    // boxShadow: '1px 1px 2px 2px #ccc',
    border: 'solid 1px #c2c2c2',
    // border: 2,
    borderColor: '#B0B0B0',
    // borderRadius: 3,
    padding: '0px'
  },
  listItem: {
    // borderBottom: '1px solid #ccc'
    // marginBottom: 5,
    // boxShadow: '1px 1px 3px #ccc'
  }
}));

const EditRole = (props) => {
  const { change, open, role, permission, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  let formikManagement = null;
  const [checked, setChecked] = useState([]);
  const [active, setActive] = useState({
    open: false,
    change: []
  });
  const initialValues = {
    oldName: role.role.slice(5),
    name: role.role.slice(5),
    permissionChecked: checked,
    permissionExisted:role.permissions
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required.')
  });

  const handleCloseEditRole = () => {
    setActive({
      ...active,
      open: false
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  //* confirm dialog
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = () => {
    dispatch(updateRole(formikManagement.values));
    handleCloseEditRole();
    setDialogConfirm(false);
  };
  const handleCloseDialog = () => setDialogConfirm(false);
  const handleSubmit = async () => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();
    if (formikManagement.isValid) setDialogConfirm(true);
  };

  useEffect(() => {
    setActive({
      open: open,
      change: change
    });
    const listPermission = [];
    role.permissions.forEach((item) => {
      listPermission.push(
        `${item[2]} ${item[3]} ${item[1]} ${item[0].slice(1)}`
      );
    });
    setChecked(listPermission);
    // eslint-disable-next-line
  }, [change]);
  useEffect(() => {
    const setValuePermission = async () => {
      if (formikManagement) {
        await formikManagement.setFieldValue('permissionChecked', checked);
      }
    };
    setValuePermission();
  }, [checked]);

  return (
    <div>
      <Dialog
        {...rest}
        aria-labelledby="max-width-dialog-title"
        className={classes.root}
        open={active.open}
        fullWidth
        maxWidth="xs"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {(formik) => {
            formikManagement = formik;
            return (
              <Form>
                <Card>
                  <CardHeader title="Update Role" />
                  <Divider />
                  <CardContent className={classes.dialogContent}>
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      label="* Name"
                      name="name"
                    />
                    <div
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        paddingBottom: '10px',
                        paddingTop: '10px'
                      }}
                    >
                      Permissions
                    </div>
                    <List dense className={classes.list}>
                      {permission.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value[0]}`;
                        return (
                          <ListItem
                            className={classes.listItem}
                            onClick={handleToggle(
                              value[1].indexOf('own') >= 0
                                ? `${value[2]} own ${value[1].slice(0, value[1].indexOf(':'))} ${value[0].slice(1)}`
                                : `${value[2]} any ${value[1].slice(0, value[1].indexOf(':'))} ${value[0].slice(1)}`
                            )}
                            key={`${value[2]} ${value[1]} ${value[0].slice(1)}`}
                            button
                          >
                            <ListItemText
                              id={labelId}
                              primary={
                                value[1].indexOf('own') >= 0
                                  ? `${value[2]} own ${value[1].slice(
                                    0, value[1].indexOf(':')
                                  )} ${value[0].slice(1)}`
                                  : `${value[2]} any ${value[1].slice(
                                    0, value[1].indexOf(':')
                                  )} ${value[0].slice(1)}`
                              }
                            />
                            <ListItemSecondaryAction>
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(
                                  value[1].indexOf('own') >= 0
                                    ? `${value[2]} own ${value[1].slice(0, value[1].indexOf(':'))} ${value[0].slice(1)}`
                                    : `${value[2]} any ${value[1].slice(0, value[1].indexOf(':'))} ${value[0].slice(1)}`
                                )}
                                checked={
                                  checked.indexOf(
                                    value[1].indexOf('own') >= 0
                                      ? `${value[2]} own ${value[1].slice(
                                        0, value[1].indexOf(':')
                                      )} ${value[0].slice(1)}`
                                      : `${value[2]} any ${value[1].slice(
                                        0, value[1].indexOf(':')
                                      )} ${value[0].slice(1)}`
                                  ) !== -1
                                }
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </CardContent>
                </Card>
                <CardActions className={classes.button}>
                  <CustomButton
                    onClick={handleCloseEditRole}
                    variant="contained"
                    content="Cancel"
                    theme="gray-full"
                  >
                    <Cancel className={classes.icon} />
                  </CustomButton>
                  <CustomButton
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    content="Save Change"
                    theme="blue-full"
                    disabled={!formikManagement.isValid}
                  >
                    <Save className={classes.icon} />
                  </CustomButton>
                </CardActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <DialogConfirm
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
        message="Update role in system"
        open={dialogConfirm}
      />
    </div>
  );
};

EditRole.prototype = {};

export default EditRole;
